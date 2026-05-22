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

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', slug: '', description: '', category: 'umum' });
  const [creating, setCreating] = useState(false);

  const router = useRouter();
  const notifyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(notifyTimerRef.current), []);

  const loadTemplates = () => {
    fetch('/api/admin/templates')
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

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setCreateForm((f) => ({ ...f, name, slug }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
        ❌ {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Manajemen Template</h1>
          <p className="text-gray-500 text-sm">
            {templates.filter((t) => t.is_active).length} aktif dari {templates.length} template
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/25"
        >
          + Tambah Template
        </button>
      </div>

      {/* Notifications */}
      {actionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          ❌ {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
          ✅ {actionSuccess}
        </div>
      )}

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white rounded-2xl p-6 border border-amber-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Buat Template Baru</h2>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Template</label>
              <input
                type="text"
                required
                value={createForm.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Nama template"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                required
                value={createForm.slug}
                onChange={(e) => setCreateForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                placeholder="slug-template"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={createForm.category}
                onChange={(e) => setCreateForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="umum">Umum</option>
                <option value="modern">Modern</option>
                <option value="klasik">Klasik</option>
                <option value="islami">Islami</option>
                <option value="minimalis">Minimalis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <input
                type="text"
                value={createForm.description}
                onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Deskripsi singkat (opsional)"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all"
              >
                {creating ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Templates List */}
      {templates.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Template</h2>
          <p className="text-gray-500">Tambahkan template pertama menggunakan tombol di atas.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {templates.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all">
              {editingId === t.id ? (
                /* Inline edit form */
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nama</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi</label>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleSaveEdit(t.id)}
                      disabled={processingId === t.id}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm rounded-xl font-medium transition-all"
                    >
                      {processingId === t.id ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Normal view */
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                    🎨
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{t.name}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        t.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {t.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-50 text-purple-600 font-medium">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate font-mono">{t.slug}</p>
                    {t.description && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{t.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Digunakan {t.usage_count}x
                      <span className="mx-1.5">·</span>
                      {new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActive(t)}
                      disabled={processingId === t.id}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all disabled:opacity-50 ${
                        t.is_active
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-green-50 hover:bg-green-100 text-green-700'
                      }`}
                    >
                      {t.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button
                      onClick={() => startEdit(t)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs rounded-lg transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      disabled={processingId === t.id}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded-lg transition-all disabled:opacity-50"
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
