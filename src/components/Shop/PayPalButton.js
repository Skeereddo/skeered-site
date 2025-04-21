const onApprove = async (data, actions) => {
  try {
    const response = await fetch('https://misty-frog-d87f.zucconichristian36.workers.dev/api/capture-paypal-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}` // Make sure to include auth token
      },
      credentials: 'include',
      body: JSON.stringify({
        orderID: data.orderID
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment capture failed');
    }

    const captureData = await response.json();
    
    if (captureData.status === 'COMPLETED') {
      // Handle successful payment
      navigate('/success');
    } else {
      throw new Error('Payment not completed');
    }
  } catch (error) {
    console.error('Payment capture error:', error);
    navigate('/error');
  }
}; 