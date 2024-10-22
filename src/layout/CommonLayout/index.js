import PropTypes from 'prop-types';
import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

// material-ui
import { Container, Toolbar } from '@mui/material';

// project-imports
import ComponentLayout from './ComponentLayout';
import { dispatch, useSelector } from 'store';
import { openComponentDrawer } from 'store/reducers/menu';

// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// ==============================|| LOADER - WRAPPER ||============================== //

const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}));

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress color="primary" />
  </LoaderWrapper>
);

// ==============================|| MINIMAL LAYOUT ||============================== //

const CommonLayout = ({ layout = 'blank' }) => {
  const { componentDrawerOpen } = useSelector((state) => state.menu);

  const handleDrawerOpen = () => {
    dispatch(openComponentDrawer({ componentDrawerOpen: !componentDrawerOpen }));
  };

  return (
    <>
      {(layout === 'landing' || layout === 'simple') && (
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      )}
      {layout === 'component' && (
        <Suspense fallback={<Loader />}>
          <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
            <Toolbar sx={{ mt: 2 }} />
            <ComponentLayout handleDrawerOpen={handleDrawerOpen} componentDrawerOpen={componentDrawerOpen} />
          </Container>
        </Suspense>
      )}
      {layout === 'blank' && <Outlet />}
    </>
  );
};

CommonLayout.propTypes = {
  layout: PropTypes.string
};

export default CommonLayout;
