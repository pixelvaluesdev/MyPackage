export const revenueChartData = {
  options: {
    dataLabels: {
      enabled: false
    },
    yaxis: {
      min: 0,
      max: 100
    },
    labels: ['Small', 'Large', 'Extra Large', 'Medium'],
    legend: {
      show: true,
      position: 'right',
      fontFamily: 'inherit',
      labels: {
        colors: 'inherit'
      },
      itemMargin: {
        horizontal: 5,
        vertical: 2
      }
    }
  },
  series: [1258, 975, 500, 750]
};
