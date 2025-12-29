<script>
  import { onMount } from 'svelte';
  import { progressStore } from '../stores/progressStore.js';

  let username = '';
  let email = '';
  let avatar = '';
  let isEditing = false;
  let tempUsername = '';

  // Avatar options
  const avatarOptions = [
    '👨‍🎓', '👩‍🎓', '🧑‍🎓',
    '👨‍🏫', '👩‍🏫', '🧑‍🏫',
    '🎵', '🎸', '🎹', '🎤', '🥁', '🎼',
    '😊', '😎', '🤓', '😃', '🙂', '😇'
  ];

  onMount(() => {
    if ($progressStore) {
      username = $progressStore.username || 'Music Teacher';
      email = $progressStore.email || 'teacher@example.com';
      avatar = $progressStore.avatar || '👨‍🎓';
    }
  });

  function startEditing() {
    tempUsername = username;
    isEditing = true;
  }

  function cancelEditing() {
    isEditing = false;
    tempUsername = '';
  }

  function saveProfile() {
    username = tempUsername;

    // Update the store
    if ($progressStore) {
      const updated = {
        ...$progressStore,
        username: username,
        avatar: avatar
      };
      progressStore.save(updated);
    }

    isEditing = false;
  }

  function selectAvatar(selectedAvatar) {
    avatar = selectedAvatar;
  }
</script>

<div class="profile-page">
  <div class="profile-container">
    <!-- Profile Header -->
    <div class="profile-header">
      <h2>Mijn Profiel</h2>
      <p class="subtitle">Beheer je accountgegevens en voorkeuren</p>
    </div>

    <!-- Profile Card -->
    <div class="profile-card">
      <div class="card-section">
        <h3>Persoonlijke Informatie</h3>

        <div class="avatar-section">
          <div class="current-avatar-container">
            <label>Huidige Avatar</label>
            <div class="current-avatar">
              <span class="avatar-large">{avatar}</span>
            </div>
          </div>

          <div class="avatar-picker">
            <label>Kies een avatar:</label>
            <div class="avatar-grid">
              {#each avatarOptions as option}
                <button
                  class="avatar-option"
                  class:selected={avatar === option}
                  on:click={() => selectAvatar(option)}
                >
                  {option}
                </button>
              {/each}
            </div>
          </div>
        </div>

        <div class="info-row">
          <label>Naam</label>
          {#if isEditing}
            <input
              type="text"
              bind:value={tempUsername}
              placeholder="Jouw naam"
              class="input-field"
            />
          {:else}
            <div class="info-value">{username}</div>
          {/if}
        </div>

        <div class="info-row">
          <label>Email</label>
          <div class="info-value">
            {email}
            <span class="badge-disabled">Niet bewerkbaar</span>
          </div>
        </div>

        <div class="actions">
          {#if isEditing}
            <button class="btn-primary" on:click={saveProfile}>
              Opslaan
            </button>
            <button class="btn-secondary" on:click={cancelEditing}>
              Annuleren
            </button>
          {:else}
            <button class="btn-primary" on:click={startEditing}>
              Profiel Bewerken
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Billing Card (Placeholder) -->
    <div class="profile-card">
      <div class="card-section">
        <div class="section-header">
          <h3>Facturering & Abonnement</h3>
          <span class="badge-coming-soon">Binnenkort beschikbaar</span>
        </div>

        <div class="placeholder-content">
          <div class="placeholder-icon">💳</div>
          <p class="placeholder-text">
            Abonnementen en betalingsopties komen binnenkort beschikbaar.
          </p>
          <p class="placeholder-subtext">
            Voorlopig is alle content gratis toegankelijk.
          </p>
        </div>

        <div class="info-box">
          <strong>🎉 Vroege toegang</strong>
          <p>Je hebt gratis toegang tot alle cursussen tijdens de bètafase!</p>
        </div>
      </div>
    </div>

    <!-- Account Actions -->
    <div class="profile-card danger-zone">
      <div class="card-section">
        <h3>Account Acties</h3>

        <div class="action-item">
          <div class="action-info">
            <strong>Uitloggen</strong>
            <p>Log uit van je account</p>
          </div>
          <button class="btn-secondary" disabled>
            <span class="lock-icon">🔒</span> Uitloggen
          </button>
        </div>

        <div class="action-item">
          <div class="action-info">
            <strong>Account Verwijderen</strong>
            <p>Permanent verwijderen van je account en alle gegevens</p>
          </div>
          <button class="btn-danger" disabled>
            <span class="lock-icon">🔒</span> Account Verwijderen
          </button>
        </div>

        <div class="info-box warning">
          <strong>ℹ️ Authenticatie komt binnenkort</strong>
          <p>Login/logout functionaliteit wordt toegevoegd in een toekomstige update.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .profile-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    overflow-x: hidden;
  }

  @media (max-width: 768px) {
    .profile-page {
      padding: 1rem;
    }
  }

  .profile-header {
    margin-bottom: 2rem;
  }

  .profile-header h2 {
    margin: 0 0 0.5rem 0;
    color: var(--primary-color);
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    .profile-header h2 {
      font-size: 1.5rem;
    }
  }

  .subtitle {
    margin: 0;
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .profile-card {
    background: var(--surface);
    border-radius: 0.75rem;
    box-shadow: var(--shadow);
    margin-bottom: 1.5rem;
    border: 1px solid var(--border);
    max-width: 100%;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .profile-card {
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
  }

  .card-section {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .card-section {
      padding: 1.25rem;
    }
  }

  .card-section h3 {
    margin: 0 0 1.5rem 0;
    color: var(--text-primary);
    font-size: 1.25rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .section-header h3 {
    margin: 0;
  }

  .avatar-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
  }

  @media (min-width: 769px) {
    .avatar-section {
      flex-direction: row;
      gap: 2rem;
    }
  }

  .current-avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .current-avatar-container label {
    font-weight: 600;
    color: var(--text-primary);
  }

  .current-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background);
    border-radius: 0.75rem;
    padding: 1rem;
    border: 2px solid var(--border);
  }

  .avatar-large {
    font-size: 5rem;
    line-height: 1;
  }

  .avatar-picker {
    flex: 1;
  }

  .avatar-picker label {
    display: block;
    margin-bottom: 0.75rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .avatar-grid {
      grid-template-columns: repeat(5, 1fr);
      gap: 0.625rem;
    }
  }

  @media (max-width: 480px) {
    .avatar-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .avatar-option {
    font-size: 2rem;
    padding: 0.5rem;
    border: 2px solid var(--border);
    border-radius: 0.5rem;
    background: var(--background);
    cursor: pointer;
    transition: all 0.2s ease;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .avatar-option {
      font-size: 1.75rem;
      padding: 0.375rem;
    }
  }

  .avatar-option:hover {
    border-color: var(--primary-color);
    transform: scale(1.1);
  }

  .avatar-option.selected {
    border-color: var(--primary-color);
    background: rgba(44, 95, 124, 0.1);
    box-shadow: 0 0 0 2px rgba(44, 95, 124, 0.2);
  }

  .info-row {
    margin-bottom: 1.5rem;
  }

  .info-row label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.9375rem;
  }

  .info-value {
    padding: 0.75rem 1rem;
    background: var(--background);
    border-radius: 0.5rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .input-field {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--border);
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s ease;
  }

  .input-field:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .actions {
      flex-direction: column;
    }
  }

  .btn-primary, .btn-secondary, .btn-danger {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    min-height: 44px;
  }

  @media (max-width: 768px) {
    .btn-primary, .btn-secondary, .btn-danger {
      width: 100%;
      padding: 1rem 1.5rem;
      min-height: 56px;
    }
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: var(--surface);
    color: var(--text-primary);
    border: 2px solid var(--border);
  }

  .btn-secondary:hover:not(:disabled) {
    border-color: var(--primary-color);
  }

  .btn-danger {
    background: transparent;
    color: var(--error);
    border: 2px solid var(--error);
  }

  .btn-danger:hover:not(:disabled) {
    background: var(--error);
    color: white;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .badge-disabled {
    font-size: 0.75rem;
    padding: 0.25rem 0.625rem;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0.25rem;
    color: var(--text-secondary);
    font-weight: 600;
  }

  .badge-coming-soon {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    background: rgba(232, 151, 78, 0.15);
    border-radius: 0.25rem;
    color: var(--warning);
    font-weight: 600;
  }

  .placeholder-content {
    text-align: center;
    padding: 3rem 2rem;
  }

  .placeholder-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .placeholder-text {
    font-size: 1.125rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .placeholder-subtext {
    color: var(--text-secondary);
    font-size: 0.9375rem;
  }

  .info-box {
    padding: 1rem 1.25rem;
    background: rgba(107, 158, 120, 0.1);
    border-left: 4px solid var(--success);
    border-radius: 0.5rem;
    margin-top: 1.5rem;
  }

  .info-box strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--success);
  }

  .info-box p {
    margin: 0;
    color: var(--text-primary);
    font-size: 0.9375rem;
  }

  .info-box.warning {
    background: rgba(232, 151, 78, 0.1);
    border-left-color: var(--warning);
  }

  .info-box.warning strong {
    color: var(--warning);
  }

  .danger-zone {
    border-color: rgba(200, 90, 84, 0.3);
  }

  .action-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    background: var(--background);
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .action-item {
      flex-direction: column;
      align-items: flex-start;
      padding: 1rem;
    }

    .action-item button {
      width: 100%;
    }
  }

  .action-info strong {
    display: block;
    margin-bottom: 0.25rem;
    color: var(--text-primary);
  }

  .action-info p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .lock-icon {
    opacity: 0.5;
  }
</style>
