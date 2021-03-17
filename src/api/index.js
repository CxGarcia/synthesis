const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? `${process.env.REACT_APP_DEV_SERVER_URL}`
    : `${process.env.REACT_APP_PROD_SERVER_URL}`;

async function getSampleNames() {
  const sampleNames = await fetch(`${BASE_URL}/samples`).then((res) => {
    return res.json();
  });
  return sampleNames;
}

export { getSampleNames, BASE_URL };
