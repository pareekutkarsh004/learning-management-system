import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import aspect  from '../../assets/assets';

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setDashboardData(assets.dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1>Educator Dashboard</h1>
    </div>
  );
};

export default Dashboard;
