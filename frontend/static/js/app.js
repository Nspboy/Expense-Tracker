/* ===================================================
   Expense Tracker — App JavaScript
   Handles: CSRF, AJAX CRUD, Modals, Toasts, Filters
   =================================================== */

// ── CSRF Helper ─────────────────────────────────────
function getCsrfToken() {
  return document.cookie.split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('csrftoken='))
    ?.split('=')[1] || '';
}

async function apiFetch(url, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    },
    credentials: 'same-origin',
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── Toast Notifications ──────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-custom ${type} d-flex align-items-center gap-2`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.innerHTML = `<span style="font-size:1rem">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  // Animate in
  setTimeout(() => toast.style.opacity = '1', 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Modal Helpers ────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const m = new bootstrap.Modal(el);
  m.show();
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const m = bootstrap.Modal.getInstance(el);
  if (m) m.hide();
}

function resetForm(id) {
  const f = document.getElementById(id);
  if (f) f.reset();
}

// ── Sidebar Mobile Toggle ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay?.classList.toggle('show');
    });
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Init tooltips
  const tooltipEls = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipEls.forEach(el => new bootstrap.Tooltip(el));
});

// ── Chart.js Defaults ────────────────────────────────
function setChartDefaults() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.color = '#8b8fa8';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
  Chart.defaults.font.family = 'Inter, sans-serif';
  Chart.defaults.font.size = 12;
}

// ── Goal Progress Rings ──────────────────────────────
function initGoalRings() {
  document.querySelectorAll('.goal-ring').forEach(ring => {
    const pct     = parseInt(ring.dataset.pct || 0);
    const fg      = ring.querySelector('.fg-ring');
    const radius  = 42;
    const circ    = 2 * Math.PI * radius;
    if (fg) {
      fg.setAttribute('stroke-dasharray', circ);
      fg.setAttribute('stroke-dashoffset', circ - (circ * pct / 100));
    }
  });
}

// ── EXPENSE CRUD ─────────────────────────────────────
function initExpenseCRUD() {
  // ADD
  const addBtn = document.getElementById('btn-add-expense');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      document.getElementById('expense-modal-title').textContent = 'Add Expense';
      resetForm('expense-form');
      document.getElementById('expense-id').value = '';
      openModal('expenseModal');
    });
  }

  // SAVE (add or edit)
  const saveBtn = document.getElementById('btn-save-expense');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const id = document.getElementById('expense-id').value;
      const payload = {
        title:          document.getElementById('exp-title').value,
        amount:         document.getElementById('exp-amount').value,
        category:       document.getElementById('exp-category').value,
        date:           document.getElementById('exp-date').value,
        payment_method: document.getElementById('exp-payment').value,
        notes:          document.getElementById('exp-notes').value,
      };
      try {
        const url = id ? `/expenses/${id}/edit/` : '/expenses/add/';
        await apiFetch(url, 'POST', payload);
        closeModal('expenseModal');
        showToast(id ? 'Expense updated!' : 'Expense added!', 'success');
        setTimeout(() => location.reload(), 600);
      } catch (e) {
        showToast(e.message, 'error');
      }
    });
  }

  // EDIT — delegate click on .btn-edit-expense
  document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-edit-expense');
    if (!btn) return;
    const id = btn.dataset.id;
    try {
      const data = await apiFetch(`/expenses/${id}/`);
      document.getElementById('expense-modal-title').textContent = 'Edit Expense';
      document.getElementById('expense-id').value   = data.id;
      document.getElementById('exp-title').value    = data.title;
      document.getElementById('exp-amount').value   = data.amount;
      document.getElementById('exp-category').value = data.category || '';
      document.getElementById('exp-date').value     = data.date;
      document.getElementById('exp-payment').value  = data.payment_method;
      document.getElementById('exp-notes').value    = data.notes;
      openModal('expenseModal');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // DELETE
  document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-delete-expense');
    if (!btn) return;
    if (!confirm('Delete this expense?')) return;
    const id = btn.dataset.id;
    try {
      await apiFetch(`/expenses/${id}/delete/`, 'POST');
      btn.closest('tr')?.remove();
      showToast('Expense deleted!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// ── INCOME CRUD ──────────────────────────────────────
function initIncomeCRUD() {
  const addBtn = document.getElementById('btn-add-income');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      document.getElementById('income-modal-title').textContent = 'Add Income';
      resetForm('income-form');
      document.getElementById('income-id').value = '';
      openModal('incomeModal');
    });
  }

  const saveBtn = document.getElementById('btn-save-income');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const id = document.getElementById('income-id').value;
      const payload = {
        source: document.getElementById('inc-source').value,
        amount: document.getElementById('inc-amount').value,
        date:   document.getElementById('inc-date').value,
        notes:  document.getElementById('inc-notes').value,
      };
      try {
        const url = id ? `/income/${id}/edit/` : '/income/add/';
        await apiFetch(url, 'POST', payload);
        closeModal('incomeModal');
        showToast(id ? 'Income updated!' : 'Income added!', 'success');
        setTimeout(() => location.reload(), 600);
      } catch (e) {
        showToast(e.message, 'error');
      }
    });
  }

  document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-edit-income');
    if (!btn) return;
    const id = btn.dataset.id;
    try {
      const data = await apiFetch(`/income/${id}/`);
      document.getElementById('income-modal-title').textContent = 'Edit Income';
      document.getElementById('income-id').value  = data.id;
      document.getElementById('inc-source').value = data.source;
      document.getElementById('inc-amount').value = data.amount;
      document.getElementById('inc-date').value   = data.date;
      document.getElementById('inc-notes').value  = data.notes;
      openModal('incomeModal');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-delete-income');
    if (!btn) return;
    if (!confirm('Delete this income?')) return;
    try {
      await apiFetch(`/income/${btn.dataset.id}/delete/`, 'POST');
      btn.closest('tr')?.remove();
      showToast('Income deleted!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// ── BUDGET CRUD ──────────────────────────────────────
function initBudgetCRUD() {
  const saveBtn = document.getElementById('btn-save-budget');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const payload = {
        category:     document.getElementById('bud-category').value,
        limit_amount: document.getElementById('bud-limit').value,
        month:        document.getElementById('bud-month').value,
        year:         document.getElementById('bud-year').value,
      };
      try {
        await apiFetch('/budgets/add/', 'POST', payload);
        closeModal('budgetModal');
        showToast('Budget saved!', 'success');
        setTimeout(() => location.reload(), 600);
      } catch (e) {
        showToast(e.message, 'error');
      }
    });
  }

  document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-delete-budget');
    if (!btn) return;
    if (!confirm('Delete this budget?')) return;
    try {
      await apiFetch(`/budgets/${btn.dataset.id}/delete/`, 'POST');
      btn.closest('.budget-card')?.remove();
      showToast('Budget deleted!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// ── GOAL CRUD ────────────────────────────────────────
function initGoalCRUD() {
  const addBtn = document.getElementById('btn-add-goal');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      document.getElementById('goal-modal-title').textContent = 'Add Goal';
      resetForm('goal-form');
      document.getElementById('goal-id').value = '';
      openModal('goalModal');
    });
  }

  const saveBtn = document.getElementById('btn-save-goal');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const id = document.getElementById('goal-id').value;
      const payload = {
        name:           document.getElementById('goal-name').value,
        target_amount:  document.getElementById('goal-target').value,
        current_amount: document.getElementById('goal-current').value || 0,
        end_date:       document.getElementById('goal-date').value,
      };
      try {
        const url = id ? `/goals/${id}/update/` : '/goals/add/';
        await apiFetch(url, 'POST', payload);
        closeModal('goalModal');
        showToast(id ? 'Goal updated!' : 'Goal created!', 'success');
        setTimeout(() => location.reload(), 600);
      } catch (e) {
        showToast(e.message, 'error');
      }
    });
  }

  document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-edit-goal');
    if (!btn) return;
    const id = btn.dataset.id;
    try {
      const data = await apiFetch(`/goals/${id}/`);
      document.getElementById('goal-modal-title').textContent = 'Edit Goal';
      document.getElementById('goal-id').value      = data.id;
      document.getElementById('goal-name').value    = data.name;
      document.getElementById('goal-target').value  = data.target_amount;
      document.getElementById('goal-current').value = data.current_amount;
      document.getElementById('goal-date').value    = data.end_date;
      openModal('goalModal');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-delete-goal');
    if (!btn) return;
    if (!confirm('Delete this goal?')) return;
    try {
      await apiFetch(`/goals/${btn.dataset.id}/delete/`, 'POST');
      btn.closest('.goal-card')?.remove();
      showToast('Goal deleted!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// ── REMINDER CRUD ────────────────────────────────────
function initReminderCRUD() {
  const saveBtn = document.getElementById('btn-save-reminder');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const payload = {
        title:     document.getElementById('rem-title').value,
        category:  document.getElementById('rem-category').value,
        amount:    document.getElementById('rem-amount').value,
        date:      document.getElementById('rem-date').value,
        frequency: document.getElementById('rem-frequency').value,
      };
      try {
        await apiFetch('/reminders/add/', 'POST', payload);
        closeModal('reminderModal');
        showToast('Reminder added!', 'success');
        setTimeout(() => location.reload(), 600);
      } catch (e) {
        showToast(e.message, 'error');
      }
    });
  }

  document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-toggle-reminder');
    if (!btn) return;
    try {
      const data = await apiFetch(`/reminders/${btn.dataset.id}/toggle/`, 'POST');
      const badge = btn.closest('tr')?.querySelector('.status-badge');
      if (badge) {
        badge.className = `status-badge ${data.status.toLowerCase()}`;
        badge.textContent = data.status;
      }
      btn.textContent = data.status === 'Paid' ? 'Mark Pending' : 'Mark Paid';
      showToast(`Marked as ${data.status}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-delete-reminder');
    if (!btn) return;
    if (!confirm('Delete this reminder?')) return;
    try {
      await apiFetch(`/reminders/${btn.dataset.id}/delete/`, 'POST');
      btn.closest('tr')?.remove();
      showToast('Reminder deleted!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// ── Live Filter / Search ─────────────────────────────
function initLiveFilter() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  let timer;
  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('search', searchInput.value);
      window.location.href = url.toString();
    }, 400);
  });
}

// ── Dashboard Charts ─────────────────────────────────
function initDashboardCharts() {
  setChartDefaults();
  const doughnutEl = document.getElementById('catDoughnutChart');
  if (doughnutEl) {
    const labels = JSON.parse(doughnutEl.dataset.labels || '[]');
    const values = JSON.parse(doughnutEl.dataset.values || '[]');
    const colors = JSON.parse(doughnutEl.dataset.colors || '[]');
    new Chart(doughnutEl, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors.length ? colors : generateColors(labels.length),
          borderWidth: 2,
          borderColor: '#1a1d2e',
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, usePointStyle: true, pointStyleWidth: 8 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: $${ctx.parsed.toLocaleString()}`
            }
          }
        }
      }
    });
  }

  const lineEl = document.getElementById('trendLineChart');
  if (lineEl) {
    const labels  = JSON.parse(lineEl.dataset.labels  || '[]');
    const income  = JSON.parse(lineEl.dataset.income  || '[]');
    const expense = JSON.parse(lineEl.dataset.expense || '[]');
    new Chart(lineEl, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: income,
            borderColor: '#26DE81',
            backgroundColor: 'rgba(38,222,129,0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#26DE81',
            pointRadius: 4,
            borderWidth: 2,
          },
          {
            label: 'Expense',
            data: expense,
            borderColor: '#FF6B6B',
            backgroundColor: 'rgba(255,107,107,0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#FF6B6B',
            pointRadius: 4,
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' } },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { callback: v => '$' + v.toLocaleString() }
          }
        }
      }
    });
  }
}

// ── Analytics Charts ─────────────────────────────────
function initAnalyticsCharts() {
  setChartDefaults();

  // Monthly bar chart
  const barEl = document.getElementById('monthlyBarChart');
  if (barEl) {
    const labels  = JSON.parse(barEl.dataset.labels  || '[]');
    const income  = JSON.parse(barEl.dataset.income  || '[]');
    const expense = JSON.parse(barEl.dataset.expense || '[]');
    new Chart(barEl, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: income,
            backgroundColor: 'rgba(38,222,129,0.7)',
            borderColor: '#26DE81',
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: 'Expenses',
            data: expense,
            backgroundColor: 'rgba(255,107,107,0.7)',
            borderColor: '#FF6B6B',
            borderWidth: 1,
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { callback: v => '$' + v.toLocaleString() }
          }
        }
      }
    });
  }

  // Category horizontal bar
  const hbarEl = document.getElementById('catBarChart');
  if (hbarEl) {
    const labels = JSON.parse(hbarEl.dataset.labels || '[]');
    const values = JSON.parse(hbarEl.dataset.values || '[]');
    const colors = JSON.parse(hbarEl.dataset.colors || '[]');
    new Chart(hbarEl, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors.length ? colors.map(c => c + 'cc') : generateColors(labels.length),
          borderColor: colors,
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { callback: v => '$' + v.toLocaleString() }
          },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // Daily line chart
  const dailyEl = document.getElementById('dailyLineChart');
  if (dailyEl) {
    const labels = JSON.parse(dailyEl.dataset.labels || '[]');
    const values = JSON.parse(dailyEl.dataset.values || '[]');
    new Chart(dailyEl, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Daily Spending',
          data: values,
          borderColor: '#7F56D9',
          backgroundColor: 'rgba(127,86,217,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#7F56D9',
          pointRadius: 3,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { maxTicksLimit: 10 } },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { callback: v => '$' + v.toLocaleString() }
          }
        }
      }
    });
  }

  // Payment doughnut
  const payEl = document.getElementById('payDoughnutChart');
  if (payEl) {
    const labels = JSON.parse(payEl.dataset.labels || '[]');
    const values = JSON.parse(payEl.dataset.values || '[]');
    new Chart(payEl, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: ['#7F56D9','#26DE81','#FF6B6B','#F7B731','#45B7D1'],
          borderWidth: 2,
          borderColor: '#1a1d2e',
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true } }
        }
      }
    });
  }
}

// ── Color Generator ──────────────────────────────────
function generateColors(n) {
  const palette = ['#7F56D9','#FF6B6B','#26DE81','#F7B731','#45B7D1','#FD9644','#FC5C65','#4ECDC4','#A55EEA','#2BCBBA'];
  return Array.from({ length: n }, (_, i) => palette[i % palette.length]);
}

// ── Auto-init ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initExpenseCRUD();
  initIncomeCRUD();
  initBudgetCRUD();
  initGoalCRUD();
  initReminderCRUD();
  initLiveFilter();
  initGoalRings();

  const page = document.body.dataset.page;
  if (page === 'dashboard') initDashboardCharts();
  if (page === 'analytics') initAnalyticsCharts();
});
