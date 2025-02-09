import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import {  useTheme } from '@mui/material';
import { Grid, ListItemButton, Menu, Stack, Typography } from '@mui/material';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import { ThemeMode } from 'config';

// assets
import { More } from 'iconsax-react';

// ==============================|| CHART ||============================== //

const TaskStatusChart = ({ color, data }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // chart options
  const areaChartOptions = {
    chart: {
      id: 'new-stack-chart',
      type: 'area',
      stacked: true,
      sparkline: {
        enabled: true
      },
      offsetX: -20
    },
    plotOptions: {
      bar: {
        borderRadius: 0
      }
    },
    dataLabels: {
      enabled: false
    },

    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0
      }
    },
    stroke: { curve: 'smooth', width: 2 },
    tooltip: {
      x: {
        show: false
      }
    },
    grid: {
      show: false
    }
  };
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [color],
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [color, mode, primary, secondary, line, theme]);

  const [series] = useState([{ name: 'Orders', data }]);

  return <ReactApexChart options={options} series={series} type="area" height={60} />;
};

TaskStatusChart.propTypes = {
  data: PropTypes.array,
  color: PropTypes.string
};

// ==============================|| CHART - PROJECT OVERVIEW ||============================== //

const ProjectOverview = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography variant="h5">Orders overview</Typography>
        <IconButton
          color="secondary"
          id="wallet-button"
          aria-controls={open ? 'wallet-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <More />
        </IconButton>
        <Menu
          id="wallet-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'wallet-button',
            sx: { p: 1.25, minWidth: 150 }
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <ListItemButton onClick={handleClose}>Today</ListItemButton>
          <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
          <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
        </Menu>
      </Stack>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={6}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs={6}>
              <Stack spacing={0.25}>
                <Typography color="text.secondary">Total Orders</Typography>
                <Typography variant="h5">34,686</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <TaskStatusChart color={theme.palette.primary.main} data={[5, 25, 3, 10, 4, 50, 0]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Stack spacing={0.25}>
                <Typography color="text.secondary">Pending Orders</Typography>
                <Typography variant="h5">3,6786</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <TaskStatusChart color={theme.palette.error.main} data={[0, 50, 4, 10, 3, 25, 5]} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ProjectOverview;
