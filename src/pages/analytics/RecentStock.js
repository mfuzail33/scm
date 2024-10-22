import React, { useState, useEffect } from 'react';
import {
    CircularProgress,
    MenuItem,
    Menu,
    IconButton,
    Typography
} from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { More, Eye } from 'iconsax-react';
import { format } from 'date-fns';
import ImageModal from 'pages/stock/ImageModal';

const RecentStock = ({ type, response }) => {
    const [loading, setLoading] = useState(false);
    const [filteredStock, setFilteredStock] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(false);

    useEffect(() => {
        fetchStock();
    }, []);

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

    const fetchStock = async () => {
        setLoading(true);
        try {

            const formattedData = response.map((item) => ({
                id: item._id,
                product: item.productId.title,
                size: item.productId.size,
                vendor: item.vendorId.name,
                quantity: item.quantity,
                remarks: item.remarks,
                person: type === 'stock-in' ? item.receiverName : item.senderName,
                date: new Date(item.date),
                time: format(new Date(item.date), 'HH:mm:ss'),
                warehouse: item.warehouse,
                images: item.images || [],
            }));
            setFilteredStock(formattedData);
        } catch (error) {
            console.error('Error fetching logs of Stock:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { name: 'product', label: 'Product' },
        { name: 'size', label: 'Product Size', options: { customBodyRender: (value) => value || 'N/A' } },
        { name: 'vendor', label: 'Vendor Name' },
        { name: 'remarks', label: 'Remarks' },
        { name: 'quantity', label: 'Quantity' },
        {
            name: 'person',
            label: type === 'stock-in' ? 'Receiver Name' : 'Sender Name',
        },
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
                    const stock = filteredStock[dataIndex];
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
            {loading ? (
                <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
            ) : (
                <MUIDataTable
                    title={
                        <Typography variant="h3">
                            {type === 'stock-in' ? 'Most Recent Stock-in' : 'Most Recent Stock-out'}
                        </Typography>
                    } data={filteredStock.slice(0, 3)}
                    columns={columns}
                    options={options}
                />
            )}

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

export default RecentStock;
