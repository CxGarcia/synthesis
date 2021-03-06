const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function getSampleNames() {
  const sampleNames = await fetch(`${BASE_URL}/samples`).then((res) =>
    res.json()
  );
  return sampleNames;
}

export { getSampleNames };
