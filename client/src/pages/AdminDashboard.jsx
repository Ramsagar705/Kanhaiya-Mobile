import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const initialProductForm = {
  title: '',
  brand: '',
  model: '',
  type: 'new',
  price: '',
  originalPrice: '',
  discount: 0,
  stock: 1,
  warranty: '12 months warranty',
  images: '',
  description: '',
  specifications: {
    ram: '',
    storage: '',
    processor: '',
    display: '',
    battery: '',
    camera: '',
    os: '',
    color: '',
    is5G: false,
    sim: '',
  },
  condition: {
    grade: 'Like New',
    batteryHealth: '',
    screenCondition: '',
    bodyCondition: '',
    repairHistory: '',
    imeiVerified: false,
  },
  featured: false,
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [bannerSlides, setBannerSlides] = useState([]);
  const [bannerSaving, setBannerSaving] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [productMessage, setProductMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);
  const [activeSection, setActiveSection] = useState('orders');

  const adminSections = [
    { id: 'orders', label: 'Recent Orders' },
    { id: 'users', label: 'Users' },
    { id: 'banners', label: 'Offer & New Phone Banners' },
    { id: 'add-product', label: 'Add Product' },
    { id: 'products', label: 'Products' },
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, usersRes, productsRes, bannersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orders'),
        api.get('/admin/users'),
        api.get('/products'),
        api.get('/admin/banners'),
      ]);

      setStats(statsRes.data.stats || { users: 0, products: 0, orders: 0, revenue: 0 });
      setOrders(ordersRes.data.orders || []);
      setUsers(usersRes.data.users || []);
      setProducts(productsRes.data.products || []);
      setBannerSlides(bannersRes.data.slides || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/order/${orderId}`, { status });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const resetProductForm = () => {
    setProductForm(initialProductForm);
    setEditingProductId(null);
    setPreviewImageIndex(0);
    setSelectedImages([]);
  };

  const handleProductInput = (field, value) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecInput = (field, value) => {
    setProductForm((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [field]: value },
    }));
  };

  const handleConditionInput = (field, value) => {
    setProductForm((prev) => ({
      ...prev,
      condition: { ...prev.condition, [field]: value },
    }));
  };

  const prepareProductFormData = () => {
    const formData = new FormData();

    formData.append('title', productForm.title.trim());
    formData.append('brand', productForm.brand.trim());
    formData.append('model', productForm.model.trim());
    formData.append('type', productForm.type);
    formData.append('price', String(Number(productForm.price)));
    formData.append('originalPrice', String(Number(productForm.originalPrice || productForm.price)));
    formData.append('discount', String(Number(productForm.discount || 0)));
    formData.append('stock', String(Number(productForm.stock || 1)));
    formData.append('warranty', productForm.warranty?.trim() || '12 months warranty');
    formData.append('description', productForm.description.trim());
    formData.append('featured', String(Boolean(productForm.featured)));
    formData.append('specifications', JSON.stringify({
      ...productForm.specifications,
      ram: productForm.specifications.ram || '',
      storage: productForm.specifications.storage || '',
    }));

    if (productForm.type === 'second_hand') {
      formData.append('condition', JSON.stringify({
        ...productForm.condition,
        grade: productForm.condition.grade || 'Like New',
      }));
    }

    selectedImages.forEach((image) => formData.append('image', image));

    return formData;
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductMessage('');

    try {
      console.log('Selected product images:', selectedImages);
      console.log('Are Files:', selectedImages.every((image) => image instanceof File));

      if (!editingProductId && selectedImages.length < 5) {
        alert('Please select at least 5 product photos before creating the product.');
        return;
      }

      const formData = prepareProductFormData();

      if (editingProductId) {
        await api.put(`/admin/products/${editingProductId}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }

      setProductMessage(editingProductId ? 'Product updated successfully.' : 'Product added successfully.');
      resetProductForm();
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Product operation failed');
    }
  };

  const editProduct = (product) => {
    setEditingProductId(product._id);
    setPreviewImageIndex(0);
    setProductForm({
      title: product.title || '',
      brand: product.brand || '',
      model: product.model || '',
      type: product.type || 'new',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      discount: product.discount || 0,
      stock: product.stock || 1,
      warranty: product.warranty || '12 months warranty',
      images: (product.images || []).join(', '),
      description: product.description || '',
      specifications: {
        ram: product.specifications?.ram || '',
        storage: product.specifications?.storage || '',
        processor: product.specifications?.processor || '',
        display: product.specifications?.display || '',
        battery: product.specifications?.battery || '',
        camera: product.specifications?.camera || '',
        os: product.specifications?.os || '',
        color: product.specifications?.color || '',
        is5G: Boolean(product.specifications?.is5G),
        sim: product.specifications?.sim || '',
      },
      condition: {
        grade: product.condition?.grade || 'Like New',
        batteryHealth: product.condition?.batteryHealth || '',
        screenCondition: product.condition?.screenCondition || '',
        bodyCondition: product.condition?.bodyCondition || '',
        repairHistory: product.condition?.repairHistory || '',
        imeiVerified: Boolean(product.condition?.imeiVerified),
      },
      featured: Boolean(product.featured),
    });
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await api.delete(`/admin/products/${productId}`);
      fetchAdminData();
      if (editingProductId === productId) resetProductForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const updateBannerSlide = (index, field, value) => {
    setBannerSlides((slides) => slides.map((slide, slideIndex) => (
      slideIndex === index ? { ...slide, [field]: value } : slide
    )));
    setBannerMessage('');
  };

  const saveBanners = async (event) => {
    event.preventDefault();
    setBannerSaving(true);
    setBannerMessage('');
    try {
      const { data } = await api.put('/admin/banners', { slides: bannerSlides });
      setBannerSlides(data.slides || []);
      setBannerMessage('Banner slides saved.');
    } catch (err) {
      setBannerMessage(err.response?.data?.message || 'Could not save banner slides.');
    } finally {
      setBannerSaving(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

  const filteredProducts = products.filter((product) => {
    const matchesType = productFilter === 'all' || product.type === productFilter;
    const query = productSearch.trim().toLowerCase();
    const searchable = `${product.title || ''} ${product.brand || ''} ${product.model || ''}`.toLowerCase();
    const matchesSearch = !query || searchable.includes(query);
    return matchesType && matchesSearch;
  });

  const formImages = productForm.images
    .split(',')
    .map((image) => image.trim())
    .filter(Boolean)
    .slice(0, 5);

  useEffect(() => {
    const previews = selectedImages.map((image) => URL.createObjectURL(image));
    setSelectedImagePreviews(previews);

    return () => previews.forEach((preview) => URL.revokeObjectURL(preview));
  }, [selectedImages]);

  const previewImages = selectedImagePreviews.length ? selectedImagePreviews : formImages;

  useEffect(() => {
    if (previewImageIndex >= formImages.length && formImages.length) {
      setPreviewImageIndex(formImages.length - 1);
    }
  }, [formImages.length, previewImageIndex]);

  const exportOrders = () => {
    const rows = [
      ['Order ID', 'Customer', 'Email', 'Phone', 'Address', 'Total', 'Payment Status', 'Order Status', 'Date'],
      ...orders.map((order) => [
        order._id,
        order.user?.name || 'Customer',
        order.user?.email || '',
        order.shippingAddress?.phone || '',
        [
          order.shippingAddress?.address,
          order.shippingAddress?.city,
          order.shippingAddress?.state,
          order.shippingAddress?.pincode,
        ]
          .filter(Boolean)
          .join(', '),
        order.totalAmount || 0,
        order.paymentStatus || 'pending',
        order.orderStatus || 'pending',
        new Date(order.createdAt).toLocaleDateString(),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-1 py-2 sm:px-2">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Control center</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Admin dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Manage the store, products, banners, and customer orders.</p>
        </div>
        <Link to="/" className="hidden items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold hover:border-premium-accent sm:flex">
          View Store
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading admin data...</p>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap gap-3">
            {adminSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  activeSection === section.id
                    ? 'border-premium-accent bg-premium-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-premium-accent hover:text-premium-900'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-gray-500">Users</p>
              <h3 className="text-3xl font-black mt-2">{stats.users}</h3>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-gray-500">Products</p>
              <h3 className="text-3xl font-black mt-2">{stats.products}</h3>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-gray-500">Orders</p>
              <h3 className="text-3xl font-black mt-2">{stats.orders}</h3>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-gray-500">Revenue</p>
              <h3 className="text-2xl font-black mt-2">{formatCurrency(stats.revenue)}</h3>
            </div>
          </div>

          {activeSection === 'orders' && (
            <div id="orders" className="bg-white rounded-2xl border p-5 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recent Orders</h2>
                <button
                  type="button"
                  onClick={exportOrders}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 hover:border-premium-accent"
                >
                  Export CSV
                </button>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 6).map((order) => (
                  <div key={order._id} className="border rounded-xl p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{order.user?.name || 'Customer'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                        <p className="text-xs text-gray-600 mt-1">Mobile: {order.shippingAddress?.phone || 'Not provided'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {order.paymentStatus || 'pending'}
                        </span>
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full">{order.orderStatus}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-semibold text-gray-700">Delivery address: </span>
                      {[
                        order.shippingAddress?.address,
                        order.shippingAddress?.city,
                        order.shippingAddress?.state,
                        order.shippingAddress?.pincode,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Not provided'}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                      <span>{order.items?.length || 0} items</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order._id, status)}
                          className={`px-2 py-1 text-xs rounded-full border ${order.orderStatus === status ? 'bg-premium-900 text-white border-premium-900' : 'bg-white text-gray-700'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div id="users" className="bg-white rounded-2xl border p-5 shadow-sm mb-8">
              <h2 className="text-xl font-bold mb-4">Users</h2>
              <div className="space-y-3">
                {users.slice(0, 8).map((user) => (
                  <div key={user._id} className="flex items-center justify-between border rounded-xl p-3">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'banners' && (
            <form id="banners" onSubmit={saveBanners} className="bg-white rounded-2xl border p-5 shadow-sm mb-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold">Offer and new phone banners</h2>
                  <p className="text-sm text-gray-500 mt-1">Add up to six image URLs. The storefront carousel changes automatically.</p>
                </div>
                <button type="submit" disabled={bannerSaving} className="shrink-0 bg-premium-900 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-60">
                  {bannerSaving ? 'Saving...' : 'Save banners'}
                </button>
              </div>
              {bannerMessage && <p className="mb-4 text-sm text-premium-accent">{bannerMessage}</p>}
              <div className="grid gap-4 lg:grid-cols-2">
                {bannerSlides.map((slide, index) => (
                  <div key={`banner-${index}`} className="border rounded-xl p-3 space-y-2">
                    <p className="text-sm font-bold">Banner {index + 1}</p>
                    <input
                      required
                      value={slide.image || ''}
                      onChange={(event) => updateBannerSlide(index, 'image', event.target.value)}
                      placeholder="Poster image URL"
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                    />
                    <input
                      value={slide.title || ''}
                      onChange={(event) => updateBannerSlide(index, 'title', event.target.value)}
                      placeholder="Headline"
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                    />
                    <input
                      value={slide.subtitle || ''}
                      onChange={(event) => updateBannerSlide(index, 'subtitle', event.target.value)}
                      placeholder="Offer text"
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                    />
                    <input
                      value={slide.link || ''}
                      onChange={(event) => updateBannerSlide(index, 'link', event.target.value)}
                      placeholder="Button link, e.g. /products/new"
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            </form>
          )}

          {activeSection === 'add-product' && (
            <form id="add-product" onSubmit={handleProductSubmit} className="bg-white rounded-2xl border p-5 shadow-sm mb-8 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
                {editingProductId && (
                  <button type="button" onClick={resetProductForm} className="text-sm text-gray-500 hover:text-gray-800">
                    Cancel
                  </button>
                )}
              </div>

              {productMessage && <p className="mb-4 text-sm text-premium-accent">{productMessage}</p>}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input value={productForm.title} onChange={(e) => handleProductInput('title', e.target.value)} placeholder="Product title" className="border rounded-xl px-3 py-2" required />
                  <input value={productForm.brand} onChange={(e) => handleProductInput('brand', e.target.value)} placeholder="Brand" className="border rounded-xl px-3 py-2" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input value={productForm.model} onChange={(e) => handleProductInput('model', e.target.value)} placeholder="Model" className="border rounded-xl px-3 py-2" required />
                  <select value={productForm.type} onChange={(e) => handleProductInput('type', e.target.value)} className="border rounded-xl px-3 py-2">
                    <option value="new">New</option>
                    <option value="second_hand">Second Hand</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={productForm.price} onChange={(e) => handleProductInput('price', e.target.value)} placeholder="Price" className="border rounded-xl px-3 py-2" required />
                  <input type="number" value={productForm.originalPrice} onChange={(e) => handleProductInput('originalPrice', e.target.value)} placeholder="Original Price" className="border rounded-xl px-3 py-2" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={productForm.discount} onChange={(e) => handleProductInput('discount', e.target.value)} placeholder="Discount %" className="border rounded-xl px-3 py-2" />
                  <input type="number" value={productForm.stock} onChange={(e) => handleProductInput('stock', e.target.value)} placeholder="Stock" className="border rounded-xl px-3 py-2" required />
                </div>

                <input
                  value={productForm.warranty}
                  onChange={(e) => handleProductInput('warranty', e.target.value)}
                  placeholder="Warranty (e.g. 12 months warranty)"
                  className="w-full border rounded-xl px-3 py-2"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="product-images" className="text-sm font-semibold text-gray-700">Product photos</label>
                    <span className={`text-xs font-semibold ${selectedImages.length === 5 ? 'text-amber-600' : 'text-gray-500'}`}>
                      {selectedImages.length}/5 photos selected
                    </span>
                  </div>
                  <input
                    id="product-image-file"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.target.files || []).slice(0, 5);
                      setSelectedImages(files);
                      setPreviewImageIndex(0);
                    }}
                    className="border rounded-xl px-3 py-2 w-full"
                  />
                  {selectedImages.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {selectedImages.map((image) => image.name).join(', ')}
                    </p>
                  )}
                  <textarea
                    id="product-images"
                    value={productForm.images}
                    onChange={(e) => handleProductInput('images', e.target.value)}
                    placeholder="Paste up to 5 image URLs, separated by commas"
                    rows={2}
                    className="border rounded-xl px-3 py-2 w-full"
                  />
                  {previewImages.length > 0 && (
                    <div className="overflow-hidden rounded-xl border bg-gray-50">
                      <div className="relative h-44">
                        <img src={previewImages[previewImageIndex]} alt={`Product preview ${previewImageIndex + 1}`} className="w-full h-full object-contain" />
                        {previewImages.length > 1 && (
                          <>
                            <button type="button" onClick={() => setPreviewImageIndex((index) => (index - 1 + previewImages.length) % previewImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1 shadow" aria-label="Previous product photo">
                              <ChevronLeft size={18} />
                            </button>
                            <button type="button" onClick={() => setPreviewImageIndex((index) => (index + 1) % previewImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1 shadow" aria-label="Next product photo">
                              <ChevronRight size={18} />
                            </button>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2 p-2 overflow-x-auto">
                        {previewImages.map((image, index) => (
                          <button type="button" key={`${image}-${index}`} onClick={() => setPreviewImageIndex(index)} className={`shrink-0 rounded-lg border-2 overflow-hidden ${previewImageIndex === index ? 'border-premium-accent' : 'border-transparent'}`} aria-label={`Show product photo ${index + 1}`}>
                            <img src={image} alt="" className="w-12 h-12 object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {formImages.length > 5 && <p className="text-xs text-red-600">Only the first five photos will be saved.</p>}
                </div>
                <textarea value={productForm.description} onChange={(e) => handleProductInput('description', e.target.value)} placeholder="Description" rows={4} className="border rounded-xl px-3 py-2 w-full" required />

                <div className="grid grid-cols-2 gap-3">
                  <input value={productForm.specifications.ram} onChange={(e) => handleSpecInput('ram', e.target.value)} placeholder="RAM" className="border rounded-xl px-3 py-2" />
                  <input value={productForm.specifications.storage} onChange={(e) => handleSpecInput('storage', e.target.value)} placeholder="Storage" className="border rounded-xl px-3 py-2" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input value={productForm.specifications.processor} onChange={(e) => handleSpecInput('processor', e.target.value)} placeholder="Processor" className="border rounded-xl px-3 py-2" />
                  <input value={productForm.specifications.display} onChange={(e) => handleSpecInput('display', e.target.value)} placeholder="Display" className="border rounded-xl px-3 py-2" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input value={productForm.specifications.battery} onChange={(e) => handleSpecInput('battery', e.target.value)} placeholder="Battery" className="border rounded-xl px-3 py-2" />
                  <input value={productForm.specifications.camera} onChange={(e) => handleSpecInput('camera', e.target.value)} placeholder="Camera" className="border rounded-xl px-3 py-2" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input value={productForm.specifications.os} onChange={(e) => handleSpecInput('os', e.target.value)} placeholder="OS" className="border rounded-xl px-3 py-2" />
                  <input value={productForm.specifications.color} onChange={(e) => handleSpecInput('color', e.target.value)} placeholder="Color" className="border rounded-xl px-3 py-2" />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={productForm.specifications.is5G} onChange={(e) => handleSpecInput('is5G', e.target.checked)} />
                  5G enabled
                </label>

                {productForm.type === 'second_hand' && (
                  <div className="space-y-3 border rounded-xl p-3 bg-gray-50">
                    <select value={productForm.condition.grade} onChange={(e) => handleConditionInput('grade', e.target.value)} className="border rounded-xl px-3 py-2 w-full">
                      <option>Like New</option>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Fair</option>
                    </select>
                    <input value={productForm.condition.batteryHealth} onChange={(e) => handleConditionInput('batteryHealth', e.target.value)} placeholder="Battery health" className="border rounded-xl px-3 py-2 w-full" />
                    <input value={productForm.condition.screenCondition} onChange={(e) => handleConditionInput('screenCondition', e.target.value)} placeholder="Screen condition" className="border rounded-xl px-3 py-2 w-full" />
                    <input value={productForm.condition.bodyCondition} onChange={(e) => handleConditionInput('bodyCondition', e.target.value)} placeholder="Body condition" className="border rounded-xl px-3 py-2 w-full" />
                    <input value={productForm.condition.repairHistory} onChange={(e) => handleConditionInput('repairHistory', e.target.value)} placeholder="Repair history" className="border rounded-xl px-3 py-2 w-full" />
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={productForm.condition.imeiVerified} onChange={(e) => handleConditionInput('imeiVerified', e.target.checked)} />
                      IMEI verified
                    </label>
                  </div>
                )}

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={productForm.featured} onChange={(e) => handleProductInput('featured', e.target.checked)} />
                  Featured product
                </label>

                <button type="submit" className="w-full bg-premium-900 text-white py-3 rounded-xl font-semibold">
                  {editingProductId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          )}

          {activeSection === 'products' && (
            <div id="products" className="bg-white rounded-2xl border p-5 shadow-sm mb-8">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold">Products</h2>
                <span className="text-xs text-gray-500">{filteredProducts.length} items</span>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products"
                  className="flex-1 border rounded-xl px-3 py-2 text-sm"
                />
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="border rounded-xl px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="second_hand">Second Hand</option>
                </select>
              </div>

              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="border rounded-xl p-3">
                    <div className="flex gap-3">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt={product.title} className="w-16 h-16 rounded-xl object-cover border" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{product.title}</p>
                            <p className="text-xs text-gray-500">{product.brand} • {product.model} • {product.type}</p>
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{product.stock} in stock</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                          <span className="text-gray-500">{product.featured ? 'Featured' : 'Standard'}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button type="button" onClick={() => editProduct(product)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium">Edit</button>
                          <button type="button" onClick={() => deleteProduct(product._id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
