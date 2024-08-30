import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Pagination, CircularProgress, FormControl, Select, MenuItem, InputLabel, IconButton } from '@mui/material';
import { apiClientAuth, API_ENDPOINTS } from '../api/apiConfig';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsTable from '../components/NotificationsTable';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [warningLevel, setWarningLevel] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState({
        warningLevel: '',
        startDate: '',
        endDate: ''
    });

    const fetchNotifications = async (params) => {
        setLoading(true);
        try {
            const response = await apiClientAuth.get(API_ENDPOINTS.NOTIFICATIONS, { params });
            setNotifications(response.data.data.results);
            setTotalPages(Math.ceil(response.data.data.count / 100)); // Assuming 100 items per page
        } catch (error) {
            setError('Failed to fetch notifications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = {
            page,
            warning_level: filters.warningLevel,
            ...(filters.startDate && { start_date: filters.startDate }),
            ...(filters.endDate && { end_date: filters.endDate }),
        };
        fetchNotifications(params);
    }, [page, filters]);

    const handleWarningLevelChange = (e) => {
        setWarningLevel(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleApplyFilters = () => {
        setFilters({
            warningLevel,
            startDate,
            endDate
        });
        setPage(1); // Reset to the first page when applying filters
    };

    const handleResetFilters = () => {
        setWarningLevel('');
        setStartDate('');
        setEndDate('');
        setFilters({
            warningLevel: '',
            startDate: '',
            endDate: ''
        });
        setPage(1); // Reset to the first page when resetting filters
    };

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
    if (error) return <Typography color="error" align="center">{error}</Typography>;

    return (
        <Container
            sx={{ mt:12,
                top: '64px',
                paddingBottom: '20px',
            }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
                Notifications Dashboard
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                        <InputLabel>Warning Level</InputLabel>
                        <Select
                            value={warningLevel}
                            onChange={handleWarningLevelChange}
                            label="Warning Level"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Good">Good</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Start Date"
                        type="date"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={handleStartDateChange}
                        sx={{ width: 150 }}
                    />

                    <TextField
                        label="End Date"
                        type="date"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={handleEndDateChange}
                        sx={{ width: 150 }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color="primary" onClick={handleApplyFilters} sx={{ borderColor: 'primary.main', border: 1 }}>
                        <FilterListIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={handleResetFilters} sx={{ borderColor: 'secondary.main', border: 1 }}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>

            {loading ? (
                <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />
            ) : (
                <>
                    <NotificationsTable notifications={notifications} />

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default NotificationsPage;