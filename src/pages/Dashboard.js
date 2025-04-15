// src/pages/Dashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import MoodChart from '../components/Dashboard/MoodChart';
import StatsSummary from '../components/Dashboard/StatsSummary';
import ActivityTracker from '../components/Dashboard/ActivityTracker';
import DailyTip from '../components/Dashboard/DailyTip';
import { fetchMoodEntries, fetchMoodStats } from '../store/slices/moodSlice';
import { ROUTES } from '../constants/routes';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile } = useSelector((state) => state.user);
  const { entries, stats, loading } = useSelector((state) => state.mood);

  useEffect(() => {
    dispatch(fetchMoodEntries('week'));
    dispatch(fetchMoodStats('month'));
  }, [dispatch]);

  const handleAddMood = () => {
    // Open modal or redirect to mood tracking page
    navigate(ROUTES.JOURNAL);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Hello, {profile?.name || 'there'}!
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddMood}
        >
          Track Today's Mood
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Mood Chart */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Your Mood Over Time
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <MoodChart moodData={entries} />
            )}
          </Paper>
        </Grid>

        {/* Stats Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Insights
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <StatsSummary stats={stats} />
            )}
          </Paper>
        </Grid>

        {/* Daily Tip */}
        <Grid item xs={12} md={4}>
          <DailyTip />
        </Grid>

        {/* Activity Tracker */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Activity
            </Typography>
            <ActivityTracker />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

