"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';

interface CarPart {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  category: string;
  priceDZD: number;
  brand?: string;
  compatible?: string;
  inStock: boolean;
  stockCount: number;
  description?: string;
  imageUrl?: string;
}

const CATEGORIES = [
  'Engine',
  'Brakes',
  'Electrical',
  'Suspension',
  'Transmission',
  'Exhaust',
  'Filters',
  'Oil',
  'Tires',
  'Body',
  'Other'
];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t, locale } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [parts, setParts] = useState<CarPart[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPart, setEditingPart] = useState<CarPart | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    nameFr: '',
    category: '',
    priceDZD: '',
    brand: '',
    compatible: '',
    inStock: true,
    stockCount: '0',
    description: '',
    imageUrl: ''
  });

  // Check if user is admin (you can add admin field to User model)
  const isAdmin = user?.email === 'admin@mechamind.com' || user?.email === 'rabahabdelhakbraham@gmail.com';

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }
    
    if (user && !isAdmin) {
      alert('Access denied. Admin only.');
      router.push('/');
      return;
    }
    
    if (user && isAdmin) {
      loadParts();
    }
  }, [user, authLoading, isAdmin, router]);

  const loadParts = async () => {
    try {
      const response = await fetch('/api/parts');
      if (response.ok) {
        const data = await response.json();
        setParts(data);
      }
    } catch (error) {
      console.error('Failed to load parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPart ? `/api/parts?id=${editingPart.id}` : '/api/parts';
      const method = editingPart ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert(editingPart ? 'Part updated!' : 'Part added!');
        resetForm();
        loadParts();
      } else {
        alert('Failed to save part');
      }
    } catch (error) {
      console.error('Error saving part:', error);
      alert('Error saving part');
    }
  };

  const handleEdit = (part: CarPart) => {
    setEditingPart(part);
    setFormData({
      nameAr: part.nameAr,
      nameEn: part.nameEn,
      nameFr: part.nameFr,
      category: part.category,
      priceDZD: part.priceDZD.toString(),
      brand: part.brand || '',
      compatible: part.compatible || '',
      inStock: part.inStock,
      stockCount: part.stockCount.toString(),
      description: part.description || '',
      imageUrl: part.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this part?')) return;
    
    try {
      const response = await fetch(`/api/parts?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Part deleted!');
        loadParts();
      }
    } catch (error) {
      console.error('Error deleting part:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      nameFr: '',
      category: '',
      priceDZD: '',
      brand: '',
      compatible: '',
      inStock: true,
      stockCount: '0',
      description: '',
      imageUrl: ''
    });
    setEditingPart(null);
    setShowForm(false);
  };

  const filteredParts = parts.filter(part => {
    const matchesSearch = !searchTerm || 
      part.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.nameFr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || part.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (authLoading || loading) {
    return <Loading />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              🔧 Admin Panel - Car Parts
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Manage spare parts inventory (Prices in DZD)
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
          >
            {showForm ? '❌ Cancel' : '➕ Add New Part'}
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editingPart ? 'Edit Part' : 'Add New Part'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name (Arabic) *</label>
                  <Input
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    required
                    placeholder="اسم القطعة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Name (English) *</label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    required
                    placeholder="Part Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Name (French)</label>
                  <Input
                    value={formData.nameFr}
                    onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                    placeholder="Nom de la pièce"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price (DZD) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.priceDZD}
                    onChange={(e) => setFormData({ ...formData, priceDZD: e.target.value })}
                    required
                    placeholder="5000.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Bosch, Valeo, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Compatible With</label>
                  <Input
                    value={formData.compatible}
                    onChange={(e) => setFormData({ ...formData, compatible: e.target.value })}
                    placeholder="Renault, Peugeot, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Stock Count</label>
                  <Input
                    type="number"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    placeholder="100"
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">In Stock</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                  rows={3}
                  placeholder="Additional details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                  {editingPart ? '💾 Update Part' : '➕ Add Part'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="🔍 Search parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Parts List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Parts List ({filteredParts.length})
            </h2>
          </div>

          {filteredParts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No parts found. Add your first part!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredParts.map(part => (
                <div
                  key={part.id}
                  className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      {locale === 'ar' ? part.nameAr : locale === 'fr' ? part.nameFr : part.nameEn}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      part.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {part.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    📦 {part.category} {part.brand && `| ${part.brand}`}
                  </p>
                  
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {part.priceDZD.toLocaleString()} DZD
                  </p>
                  
                  {part.compatible && (
                    <p className="text-xs text-gray-500 mb-2">
                      🚗 {part.compatible}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500 mb-3">
                    Stock: {part.stockCount} units
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(part)}
                      className="flex-1"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(part.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
