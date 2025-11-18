"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import toast, { Toaster } from 'react-hot-toast';

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

interface AdminStats {
  overview: {
    totalUsers: number;
    verifiedUsers: number;
    totalChats: number;
    totalMessages: number;
    totalOilChanges: number;
    totalCarParts: number;
    inStockParts: number;
    avgMessagesPerChat: number;
    newUsersThisWeek: number;
    newChatsThisWeek: number;
  };
  recentUsers: Array<{
    id: string;
    email: string;
    name: string | null;
    verified: boolean;
    createdAt: string;
  }>;
  recentChats: Array<{
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    _count: { messages: number };
  }>;
  popularCarModels: Array<{
    model: string;
    count: number;
  }>;
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
  const [activeTab, setActiveTab] = useState<'stats' | 'parts'>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
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

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }
    
    if (user) {
      // Check if user is admin from backend
      checkAdminStatus();
    }
  }, [user, authLoading, router]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check');
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
        
        if (data.isAdmin) {
          loadStats();
          loadParts();
        } else {
          toast.error('⛔ الوصول مرفوض. للمسؤولين فقط.', {
            duration: 4000
          });
          router.push('/');
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Admin check failed:', error);
      toast.error('❌ فشل التحقق من الصلاحيات', {
        duration: 4000
      });
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

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
    e.stopPropagation(); // منع التنفيذ المزدوج
    
    // منع الإرسال المتكرر
    if ((e.target as HTMLFormElement).getAttribute('data-submitting') === 'true') {
      return;
    }
    (e.target as HTMLFormElement).setAttribute('data-submitting', 'true');
    
    const loadingToast = toast.loading(editingPart ? '🔄 جاري التحديث...' : '🔄 جاري الإضافة...');
    
    try {
      const url = editingPart ? `/api/parts?id=${editingPart.id}` : '/api/parts';
      const method = editingPart ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      toast.dismiss(loadingToast);
      
      if (response.ok) {
        toast.success(editingPart ? '✅ تم التحديث بنجاح!' : '✅ تمت الإضافة بنجاح!', {
          duration: 3000,
          icon: '🎉'
        });
        resetForm();
        setShowForm(false);
        await loadParts(); // انتظر التحميل
      } else {
        const errorData = await response.json();
        toast.error(`❌ فشل الحفظ: ${errorData.error || 'خطأ غير معروف'}`, {
          duration: 4000
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error saving part:', error);
      toast.error('❌ خطأ في الحفظ', {
        duration: 4000
      });
    } finally {
      (e.target as HTMLFormElement).setAttribute('data-submitting', 'false');
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
    console.log('🗑️ Delete button clicked for ID:', id);
    
    // استخدام toast للتأكيد
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="text-center">
          <p className="font-bold text-lg mb-2">⚠️ تأكيد الحذف</p>
          <p className="text-sm text-gray-600">هل أنت متأكد من حذف هذه القطعة؟</p>
          <p className="text-xs text-red-600 mt-1">لا يمكن التراجع عن هذا الإجراء!</p>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              console.log('✅ Delete confirmed, sending request...');
              
              const loadingToast = toast.loading('🔄 جاري الحذف...');
              
              try {
                const url = `/api/parts?id=${id}`;
                console.log('🌐 DELETE URL:', url);
                
                const response = await fetch(url, { 
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
                
                console.log('📊 Response status:', response.status);
                
                const data = await response.json();
                console.log('📦 Response data:', data);
                
                toast.dismiss(loadingToast);
                
                if (response.ok) {
                  console.log('✅ تم الحذف بنجاح');
                  toast.success('✅ تم حذف القطعة بنجاح!', {
                    duration: 3000,
                    icon: '🗑️'
                  });
                  
                  console.log('🔄 Reloading parts...');
                  await loadParts();
                  console.log('✅ Parts reloaded');
                } else {
                  console.error('❌ خطأ في الحذف:', data);
                  toast.error(`❌ فشل الحذف: ${data.error || 'خطأ غير معروف'}`, {
                    duration: 4000
                  });
                }
              } catch (error) {
                toast.dismiss(loadingToast);
                console.error('❌ Exception during delete:', error);
                toast.error('❌ حدث خطأ أثناء الحذف', {
                  duration: 4000
                });
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            حذف
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              console.log('❌ Delete cancelled by user');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
          >
            إلغاء
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        minWidth: '300px',
        padding: '20px'
      }
    });
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
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            🔧 Admin Panel
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Manage users, chats, and spare parts inventory
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'stats'
                ? 'border-b-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            📊 Statistics
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'parts'
                ? 'border-b-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            🔧 Car Parts
          </button>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.overview.totalUsers}
                </div>
                <div className="text-xs text-green-600 mt-2">
                  +{stats.overview.newUsersThisWeek} this week
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Chats</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.overview.totalChats}
                </div>
                <div className="text-xs text-green-600 mt-2">
                  +{stats.overview.newChatsThisWeek} this week
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Messages</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.overview.totalMessages}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Avg: {stats.overview.avgMessagesPerChat.toFixed(1)}/chat
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">Oil Changes</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.overview.totalOilChanges}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Tracked records
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">Verified Users</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.overview.verifiedUsers}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {((stats.overview.verifiedUsers / stats.overview.totalUsers) * 100).toFixed(1)}% of total
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">Car Parts</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.overview.totalCarParts}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {stats.overview.inStockParts} in stock
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">Stock Status</div>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  {((stats.overview.inStockParts / (stats.overview.totalCarParts || 1)) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Available parts
                </div>
              </div>
            </div>

            {/* Recent Users & Chats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  👥 Recent Users
                </h3>
                <div className="space-y-3">
                  {stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString('ar-DZ')}
                        </div>
                      </div>
                      <div className="text-xs">
                        {user.verified ? '✅ Verified' : '⏳ Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Chats */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  💬 Recent Chats
                </h3>
                <div className="space-y-3">
                  {stats.recentChats.map((chat) => (
                    <div key={chat.id} className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                          {chat.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(chat.createdAt).toLocaleDateString('ar-DZ')}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {chat._count.messages} msgs
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Car Models */}
            {stats.popularCarModels.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  🚗 Popular Car Models
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {stats.popularCarModels.map((item, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="font-bold text-gray-900 dark:text-gray-100">
                        {item.model}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.count} users
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Parts Tab */}
        {activeTab === 'parts' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Car Parts Management
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Prices in DZD - Total: {parts.length} parts
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
                    <button
                      type="button"
                      onClick={() => {
                        console.log('✏️ Edit clicked for:', part.id);
                        handleEdit(part);
                      }}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('🗑️ Delete clicked for:', part.id);
                        handleDelete(part.id);
                      }}
                      className="px-3 py-1.5 text-sm border border-red-300 dark:border-red-700 rounded-md text-red-600 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 transition-colors font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1f2937',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
          success: {
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #86efac',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fca5a5',
            },
          },
          loading: {
            style: {
              background: '#f3f4f6',
              color: '#1f2937',
            },
          },
        }}
      />
    </div>
  );
}
