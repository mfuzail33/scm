import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Grid,
    CircularProgress,
    MenuItem,
    Menu,
    IconButton,
} from '@mui/material';
import MUIDataTable from 'mui-datatables';
import CreateStockOutModal from './CreateStockOutModal';
import { getStockOutLogs } from 'store/reducers/stocks';
import { More, Eye, Trash } from 'iconsax-react';
import ImageModal from './ImageModal';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import FilterChips from './FilterChips';
import DeleteLog from './DeleteLog';

const StockOut = () => {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stockOut, setStockOut] = useState([]);
    const [filteredStockOut, setFilteredStockOut] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [stockId, setStockId] = useState('');

    useEffect(() => {
        fetchStockOut();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [stockOut, selectedFilter, selectedMonth]);

    const handleMenuOpen = (event, stock) => {
        setAnchorEl(event.currentTarget);
        setSelectedStock(stock);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewImages = () => {
        setOpenImageModal(true);
        handleMenuClose();
    };

    const fetchStockOut = async () => {
        setLoading(true);
        try {
            const response = await getStockOutLogs();
            const formattedData = response.map((item) => ({
                id: item._id,
                product: item.productId.title,
                size: item.productId.size,
                vendor: item.vendorId.name,
                quantity: item.quantity,
                remarks: item.remarks,
                sender: item.senderName,
                date: new Date(item.date),
                time: format(new Date(item.date), 'HH:mm:ss'),
                warehouse: item.warehouse,
                images: item.images || [],
            }));
            setStockOut(formattedData);
        } catch (error) {
            console.error('Error fetching logs of Stock Out:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        let filteredData = stockOut;
        const today = new Date();

        if (selectedFilter === 'today') {
            filteredData = stockOut.filter((item) =>
                format(item.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
            );
        } else if (selectedFilter === 'week') {
            const start = startOfWeek(today);
            const end = endOfWeek(today);
            filteredData = stockOut.filter((item) => item.date >= start && item.date <= end);
        } else if (selectedFilter === 'month') {
            const start = startOfMonth(today);
            const end = endOfMonth(today);
            filteredData = stockOut.filter((item) => item.date >= start && item.date <= end);
        } else if (selectedFilter === 'year') {
            filteredData = stockOut.filter((item) => item.date.getFullYear() === today.getFullYear());
        } else if (selectedFilter === 'customMonth' && selectedMonth) {
            const start = startOfMonth(selectedMonth);
            const end = endOfMonth(selectedMonth);
            filteredData = stockOut.filter((item) => item.date >= start && item.date <= end);
        }

        setFilteredStockOut(filteredData);
    };

    const handleDelete = async () => {
        setStockId(selectedStock.id)
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const columns = [
        { name: 'product', label: 'Product' },
        { name: 'size', label: 'Product Size', options: { customBodyRender: (value) => value || 'N/A' } },
        { name: 'vendor', label: 'Vendor Name' },
        { name: 'remarks', label: 'Remarks' },
        { name: 'quantity', label: 'Quantity' },
        { name: 'sender', label: 'Sender Name' },
        { name: 'date', label: 'Date', options: { customBodyRender: (value) => format(new Date(value), 'MM/dd/yyyy') } },
        { name: 'time', label: 'Time', options: { customBodyRender: (value) => value } },
        { name: 'warehouse', label: 'Warehouse' },
        {
            name: 'actions',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => {
                    const stock = filteredStockOut[dataIndex];
                    return (
                        <>
                            <IconButton onClick={(event) => handleMenuOpen(event, stock)}>
                                <More />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleViewImages}>
                                    <Eye size="20" />&nbsp;&nbsp;View Images
                                </MenuItem>
                                <MenuItem onClick={handleDelete} sx={{ color: 'red' }}><Trash size="20" />&nbsp;&nbsp;Delete Log</MenuItem>
                            </Menu>
                        </>
                    );
                },
            },
        },
    ];

    const options = { selectableRows: 'none' };

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
                <Grid item>
                    <Typography variant="h3">Stock-Out Logs</Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
                        Remove Stock
                    </Button>
                </Grid>
            </Grid>

            <FilterChips
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
            />

            {loading ? (
                <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
            ) : (
                <MUIDataTable title="" data={filteredStockOut} columns={columns} options={options} />
            )}

            <CreateStockOutModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                reloadLogs={fetchStockOut}
            />

            <DeleteLog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                stockId={stockId}
                fetchStock={fetchStockOut}
                stockType={'stock-out'}
            />

            {selectedStock && (
                <ImageModal
                    open={openImageModal}
                    images={selectedStock.images}
                    onClose={() => setOpenImageModal(false)}
                />
            )}
        </>
    );
};

export default StockOut;
