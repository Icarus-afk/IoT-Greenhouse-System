// NotificationsTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip } from '@mui/material';

const getWarningLevelChip = (warningLevel) => {
    let color;
    switch (warningLevel) {
        case 'High':
            color = 'error';
            break;
        case 'Low':
            color = 'warning';
            break;
        case 'Good':
            color = 'success';
            break;
        default:
            color = 'default';
    }
    return <Chip label={warningLevel} color={color} size="small" />;
};

const NotificationsTable = ({ notifications }) => {
    return (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Message</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Warning Level</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Timestamp</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {notifications.map((notification) => (
                        <TableRow key={notification.id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' }, '&:hover': { bgcolor: '#f1f1f1' } }}>
                            <TableCell>{notification.message}</TableCell>
                            <TableCell>{getWarningLevelChip(notification.warning_level)}</TableCell>
                            <TableCell>{new Date(notification.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default NotificationsTable;