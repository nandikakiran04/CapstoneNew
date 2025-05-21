export async function fetchPayroll(year, month) {
  try {
    const response = await fetch('http://localhost:5000/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, month }),
    });

    if (!response.ok) throw new Error('Server error');
    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    return null;
  }
}
