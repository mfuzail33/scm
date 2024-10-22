// material-ui
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, CircularProgress } from '@mui/material';

// project-imports
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';
import RecentStock from './RecentStock';
import { getAllProducts, getLowQuantityProducts } from 'store/reducers/products';
import { getAllVendors } from 'store/reducers/vendors';
import { getStockInLogs, getStockOutLogs } from 'store/reducers/stocks';

// assets
import { TruckFast, ShoppingBag, House2, TrendDown } from 'iconsax-react';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Analytics = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [lqp, setLqp] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const productsData = await getAllProducts();
      setProducts(productsData.length);
      const vendorsData = await getAllVendors();
      setVendors(vendorsData.length);
      const LqpData = await getLowQuantityProducts();
      setLqp(LqpData.length);
      const stockIn = await getStockInLogs();
      setStockIn(stockIn)
      const stockOut = await getStockOutLogs();
      setStockOut(stockOut)
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
      ) : (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          {/* row 1 */}
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Total Products"
              count={products || 0}
              iconPrimary={<ShoppingBag />}
              path="/products"
            >
              <EcommerceDataChart color={theme.palette.primary.main} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Total Vendors"
              count={vendors || 0}
              color="warning"
              iconPrimary={<TruckFast color={theme.palette.warning.dark} />}
              path="/vendors"
            >
              <EcommerceDataChart color={theme.palette.warning.dark} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Total Warehouses"
              count="3"
              color="success"
              iconPrimary={<House2 color={theme.palette.success.darker} />}
            >
              <EcommerceDataChart color={theme.palette.success.darker} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Low Quantity Products"
              count={lqp || 0}
              color="error"
              iconPrimary={<TrendDown color={theme.palette.error.dark} />}
              path="/low-quantity-products"
            >
              <EcommerceDataChart color={theme.palette.error.dark} />
            </EcommerceDataCard>
          </Grid>

          {/* row 2 */}
          <Grid item xs={12} md={12} lg={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RecentStock type={'stock-in'} response={stockIn} />
              </Grid>
              <Grid item xs={12}>
                <RecentStock type={'stock-out'} response={stockOut} />
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      )}
    </>
  );
};

export default Analytics;
