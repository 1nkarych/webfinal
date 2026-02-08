document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch('/api/profile', { credentials: 'include' });
    if (!res.ok) throw new Error('Not logged in');
    const user = await res.json();

    document.getElementById('user-greeting').textContent = `Welcome, ${user.username || user.fullName}!`;
    document.getElementById('profile-name').textContent = user.fullName;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-phone').textContent = user.phone || 'Not provided';

  } catch (err) {
    alert('Failed to load profile. Please login.');
    window.location.href = '/auth.html';
  }

  const deleteBtn = document.getElementById('delete-account');
  deleteBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/profile', {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Delete failed');
      alert('Account deleted');
      window.location.href = '/';
    } catch (err) {
      alert('Failed to delete account');
    }
  });
});
