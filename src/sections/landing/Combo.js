// material-ui
import { Button, CardMedia, Container, Grid, Link, Typography } from '@mui/material';

// third party
import { motion } from 'framer-motion';

// project-imports
import FadeInWhenVisible from './Animation';
import MainCard from 'components/MainCard';

// assets
import { ExportSquare } from 'iconsax-react';
import featureFigma from 'assets/images/landing/feature-figma.png';
import featureComponents from 'assets/images/landing/feature-components.png';
import featureDocumentation from 'assets/images/landing/feature-documentation.png';

const Technologies = [
  {
    icon: featureFigma,
    title: 'Figma Design System',
    description: 'Check the live preview of Able Pro Figma design file. Figma file included in all licenses.',
    preview: 'https://links.codedthemes.com/mQZrX'
  },
  {
    icon: featureComponents,
    title: 'Explore Components',
    description: 'Access all components of Able Pro in one place to make your development work easier.',
    preview: '/components-overview/buttons'
  },
  {
    icon: featureDocumentation,
    title: 'Documentation',
    description: 'Find solutions and navigate through our helper guide with ease.',
    preview: 'https://codedthemes.gitbook.io/able-pro-bootstrap/'
  }
];

// ==============================|| LANDING - ComboPage ||============================== //

const ComboPage = () => {
  return (
    <Container>
      <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ mt: { md: 15, xs: 2.5 }, mb: { md: 10, xs: 2.5 } }}>
        <Grid item xs={12}>
          <Grid container spacing={2} justifyContent="center" sx={{ textAlign: 'center', marginBottom: 3 }}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.2
                }}
              >
                <Typography variant="h2">Complete Combo</Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.4
                }}
              >
                <Typography>
                  Able Pro caters to the needs of both developers and designers, whether they are beginners or experts.
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3} alignItems="center">
            {Technologies.map((tech, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <FadeInWhenVisible>
                  <MainCard>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h5">{tech.title}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>{tech.description}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <CardMedia component="img" image={tech.icon} sx={{ width: '100%' }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                          startIcon={<ExportSquare />}
                          component={Link}
                          href={tech.preview}
                          target="_blank"
                          sx={{
                            fontWeight: 500,
                            bgcolor: 'secondary.light',
                            color: 'secondary.darker',
                            '&:hover': { color: 'secondary.lighter' }
                          }}
                        >
                          Reference
                        </Button>
                      </Grid>
                    </Grid>
                  </MainCard>
                </FadeInWhenVisible>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
export default ComboPage;
