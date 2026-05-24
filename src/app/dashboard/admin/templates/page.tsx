'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  is_active: number;
  created_at: string;
  usage_count: number;
}

const IconTemplate = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const EmptyTemplateIcon = () => (
  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const inputCls = 'w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-150';

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', slug: '', description: '', category: 'umum' });
  const [creating, setCreating] = useState(false);

  const router = useRouter();
  const notifyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(notifyTimerRef.current), []);

  const loadTemplates = () => {
    fetch('/api/admin/templates', { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 403) { router.push('/dashboard'); return; }
        if (!res.ok) throw new Error('Gagal memuat template');
        const data = await res.json();
        setTemplates(data.templates || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTemplates(); }, []);

  const notify = (msg: string, isError = false) => {
    if (isError) { setActionError(msg); setActionSuccess(''); }
    else { setActionSuccess(msg); setActionError(''); }
    clearTimeout(notifyTimerRef.current);
    notifyTimerRef.current = setTimeout(() => { setActionError(''); setActionSuccess(''); }, 3000);
  };

  const handleToggleActive = async (t: Template) => {
    setProcessingId(t.id);
    try {
      const res = await fetch(`/api/admin/templates/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: t.is_active === 1 ? 0 : 1 }),
      });
      const data = await res.json();
      if (!res.ok) { notify(data.error || 'Gagal mengubah status', true); return; }
      notify(`Template ${t.is_active === 1 ? 'dinonaktifkan' : 'diaktifkan'}`);
      loadTemplates();
    } catch {
      notify('Gagal mengubah status template', true);
    } finally {
      setProcessingId(null);
    }
  };

  const startEdit = (t: Template) => {
    setEditingId(t.id);
    setEditForm({ name: t.name, description: t.description });
  };

  const handleSaveEdit = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) { notify(data.error || 'Gagal menyimpan', true); return; }
      notify('Template berhasil diperbarui');
      setEditingId(null);
      loadTemplates();
    } catch {
      notify('Gagal menyimpan template', true);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus template "${name}"?`)) return;
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { notify(data.error || 'Gagal menghapus', true); return; }
      notify('Template berhasil dihapus');
      loadTemplates();
    } catch {
      notify('Gagal menghapus template', true);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) { notify(data.error || 'Gagal membuat template', true); return; }
      notify('Template berhasil dibuat');
      setCreateForm({ name: '', slug: '', description: '', category: 'umum' });
      setShowCreate(false);
      loadTemplates();
    } catch {
      notify('Gagal membuat template', true);
    } finally {
      setCreating(false);
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setCreateForm((f) => ({ ...f, name, slug }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">{error}</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Manajemen Template</h1>
          <p className="text-slate-500 text-sm">
            {templates.filter((t) => t.is_active).length} aktif dari {templates.length} template
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-all duration-150 shadow-lg shadow-green-500/25"
        >
          + Tambah Template
        </button>
      </div>

      {/* Notifications */}
      {actionError && (
        <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{actionError}</div>
      )}
      {actionSuccess && (
        <div role="status" className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">{actionSuccess}</div>
      )}

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Buat Template Baru</h2>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Template</label>
              <input type="text" required value={createForm.name} onChange={(e) => handleNameChange(e.target.value)} className={inputCls} placeholder="Nama template" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input type="text" required value={createForm.slug} onChange={(e) => setCreateForm((f) => ({ ...f, slug: e.target.value }))} className={`${inputCls} font-mono`} placeholder="slug-template" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select value={createForm.category} onChange={(e) => setCreateForm((f) => ({ ...f, category: e.target.value }))} className={inputCls}>
                <option value="umum">Umum</option>
                <option value="modern">Modern</option>
                <option value="klasik">Klasik</option>
                <option value="islami">Islami</option>
                <option value="minimalis">Minimalis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
              <input type="text" value={createForm.description} onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))} className={inputCls} placeholder="Deskripsi singkat (opsional)" />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-150">Batal</button>
              <button type="submit" disabled={creating} className="px-5 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all duration-150">
                {creating ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Templates List */}
      {templates.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
          <div className="flex justify-center mb-4"><EmptyTemplateIcon /></div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Belum Ada Template</h2>
          <p className="text-slate-500">Tambahkan template pertama menggunakan tombol di atas.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {templates.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all duration-150">
              {editingId === t.id ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Nama</label>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Deskripsi</label>
                    <input type="text" value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2 flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-150">Batal</button>
                    <button onClick={() => handleSaveEdit(t.id)} disabled={processingId === t.id} className="px-4 py-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm rounded-xl font-medium transition-all duration-150">
                      {processingId === t.id ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                    <IconTemplate />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">{t.name}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        t.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {t.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-50 text-purple-600 font-medium">{t.category}</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate font-mono">{t.slug}</p>
                    {t.description && <p className="text-xs text-slate-400 mt-0.5 truncate">{t.description}</p>}
                    <p className="text-xs text-slate-400 mt-0.5">
                      Digunakan {t.usage_count}x
                      <span className="mx-1.5">&middot;</span>
                      {new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActive(t)}
                      disabled={processingId === t.id}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-150 disabled:opacity-50 ${
                        t.is_active ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-green-50 hover:bg-green-100 text-green-700'
                      }`}
                    >
                      {t.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button onClick={() => startEdit(t)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition-all duration-150">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      disabled={processingId === t.id}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded-lg transition-all duration-150 disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
