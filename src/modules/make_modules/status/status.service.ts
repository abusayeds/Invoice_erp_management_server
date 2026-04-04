const getStatusDataDB = async () => {
  const result = [
    {
      Outstanding: -5825,
      Net_Profit: 5890,
      Sales: 5896,
      Bills: 5897,
      Draft_Invoices: 487,
    },
    {
      January: 1200,
      February: 1500,
      March: 1800,
      April: 2000,
      May: 1700,
      June: 2200,
      July: 2500,
      August: 2400,
      September: 2100,
      October: 2300,
      November: 2600,
      December: 3000,
    },
  ];

  return result;
};

export const statusService = {
  getStatusDataDB,
};
