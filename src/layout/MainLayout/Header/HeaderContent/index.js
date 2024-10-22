// material-ui
import { useMediaQuery } from '@mui/material';

// project-imports
import Search from './Search';
import Profile from './Profile';

import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/MainLayout/Drawer/DrawerHeader';
import { MenuOrientation } from 'config';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {!downLG && <Search />}
      <Profile />
    </>
  );
};

export default HeaderContent;
