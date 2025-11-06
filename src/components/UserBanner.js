import React, { useEffect, useState } from 'react';

export default function UserBanner() {
  const [user, setUser] = useState({ name: '', email: '', profilePic: '' });

  // Load user info on mount
  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(res => res.ok ? res.json() : {})
      .then(data => setUser(data));
  }, []);

  const handleNameChange = async () => {
    const newName = prompt("Enter your new name:", user.name);
    if (newName && newName.trim().length > 0) {
      await fetch('/api/user', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      setUser(u => ({ ...u, name: newName }));
    }
  };

  const handlePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // convert image to base64:
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      await fetch('/api/user', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePic: base64 })
      });
      setUser(u => ({ ...u, profilePic: base64 }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="d-flex align-items-center gap-4 p-3 bg-dark rounded shadow mb-4" style={{maxWidth: 440}}>
      <div style={{ position: "relative" }}>
        <img
          src={user.profilePic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || 'U') + "&background=random"}
          alt="profile"
          width={68}
          height={68}
          style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #fff" }}
        />
        <label htmlFor="profile-pic-upload" style={{ position: "absolute", bottom: 0, right: 0, cursor: "pointer" }}>
          <span className="bg-light rounded-circle p-1"><i className="bi bi-camera"></i></span>
        </label>
        <input id="profile-pic-upload" type="file" accept="image/*" className="d-none" onChange={handlePicChange} />
      </div>
      <div>
        <div className="fw-bold fs-5 text-light">{user.name} <button className="btn btn-link btn-sm text-info" style={{padding:0}} onClick={handleNameChange}><i className="bi bi-pencil"></i></button></div>
        <div className="small text-secondary">{user.email}</div>
      </div>
    </div>
  );
}
