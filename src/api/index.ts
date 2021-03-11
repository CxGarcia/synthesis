const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

async function getSampleNames() {
  const sampleNames = await fetch(`${BASE_URL}/samples`).then((res) => {
    console.log(res);
    return res.json();
  });
  return sampleNames;
}

export { getSampleNames };
