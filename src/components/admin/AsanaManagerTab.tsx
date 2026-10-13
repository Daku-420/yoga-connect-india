import React, { useState } from 'react';
import { YogaAsana, EditorialStatus, AsanaBodyPosition, AsanaDifficulty } from '../../types';
import { mockAsanas } from '../../data/mockAsanas';
import { 
  Sparkles, 
  Search, 
  PlusCircle, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  Trash2,
  Download,
  Filter,
  Check,
  X
} from 'lucide-react';

export const AsanaManagerTab: React.FC = () => {
  const [asanas, setAsanas] = useState<YogaAsana[]>(mockAsanas);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAsanaForPreview, setSelectedAsanaForPreview] = useState<YogaAsana | null>(null);
  
  // Create / Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAsana, setEditingAsana] = useState<Partial<YogaAsana> | null>(null);

  // Bulk Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importValidationErrors, setImportValidationErrors] = useState<string[]>([]);
  const [importPreviewCount, setImportPreviewCount] = useState<number | null>(null);
  const [importParsedData, setImportParsedData] = useState<YogaAsana[] | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const filteredAsanas = asanas.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.editorialStatus === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      a.sanskritName.toLowerCase().includes(q) ||
      a.englishName.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const handleStatusChange = (id: string, newStatus: EditorialStatus) => {
    setAsanas(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          editorialStatus: newStatus,
          lastUpdatedDate: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    }));
    showToast(`Status updated to "${newStatus}"`);
  };

  const handleOpenEdit = (asana?: YogaAsana) => {
    if (asana) {
      setEditingAsana({ ...asana });
    } else {
      // New blank asana
      setEditingAsana({
        id: 'asana-' + Date.now(),
        sanskritName: '',
        sanskritDevanagari: '',
        transliterationIast: '',
        englishName: '',
        pronunciation: '',
        slug: '',
        category: 'Standing',
        bodyPositions: ['Standing'],
        difficulty: 'Beginner',
        intentions: ['Strength & Stability'],
        traditions: ['Hatha'],
        chakra: 'Muladhara (Root Chakra)',
        element: 'Earth (Prithvi)',
        targetMuscles: ['Calves', 'Quadriceps'],
        coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
        shortDescription: '',
        equipmentAndPreparation: ['Yoga mat'],
        steps: [
          { stepNumber: 1, title: 'Step 1 Foundation', instruction: '' }
        ],
        breathingCue: 'Slow diaphragmatic breaths through the nose.',
        alignmentCues: ['Keep spine lengthened.'],
        commonMistakes: [],
        variations: [],
        anatomicalBenefits: ['Strengthens lower body'],
        mentalBenefits: ['Promotes focus'],
        contraindications: ['Acute injuries'],
        safetyDisclaimer: 'This instructional guide is for educational purposes only. Not medical advice.',
        drishti: 'Nasagrai (Tip of Nose)',
        recommendedHold: '30 to 60 seconds',
        proTips: [],
        faqs: [
          { question: 'Who can practice this asana?', answer: 'Beginners can practice with proper alignment.' }
        ],
        relatedAsanaSlugs: [],
        suggestedSequences: [],
        reviewer: {
          name: 'Acharya Vishwajeet Shastri',
          qualification: 'E-RYT 500, Master of Classical Hatha',
          traditionOrSchool: 'Parmarth Niketan Tradition, Rishikesh',
          lastReviewedDate: new Date().toISOString().split('T')[0]
        },
        references: [],
        relatedCentreIds: ['centre-1'],
        seoKeywords: [],
        editorialStatus: 'draft'
      });
    }
    setIsEditModalOpen(true);
  };

  const handleSaveAsana = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsana?.sanskritName || !editingAsana?.englishName) {
      alert('Please fill in Sanskrit and English names.');
      return;
    }

    const autoSlug = editingAsana.slug || 
      `${editingAsana.sanskritName.toLowerCase().replace(/\s+/g, '-')}-${editingAsana.englishName.toLowerCase().replace(/\s+/g, '-')}`;

    const completeAsana: YogaAsana = {
      ...editingAsana,
      slug: autoSlug,
      lastUpdatedDate: new Date().toISOString().split('T')[0]
    } as YogaAsana;

    setAsanas(prev => {
      const exists = prev.find(a => a.id === completeAsana.id);
      if (exists) {
        return prev.map(a => a.id === completeAsana.id ? completeAsana : a);
      }
      return [completeAsana, ...prev];
    });

    setIsEditModalOpen(false);
    setEditingAsana(null);
    showToast(`Saved ${completeAsana.englishName}`);
  };

  const handleValidateImport = () => {
    setImportValidationErrors([]);
    setImportPreviewCount(null);
    setImportParsedData(null);

    try {
      const parsed = JSON.parse(importJsonText);
      const items: any[] = Array.isArray(parsed) ? parsed : [parsed];

      const errors: string[] = [];
      const validItems: YogaAsana[] = [];

      items.forEach((item, index) => {
        const itemNumber = index + 1;
        if (!item.sanskritName) errors.push(`Item #${itemNumber}: Missing 'sanskritName'`);
        if (!item.englishName) errors.push(`Item #${itemNumber}: Missing 'englishName'`);
        if (!item.steps || !Array.isArray(item.steps) || item.steps.length === 0) {
          errors.push(`Item #${itemNumber}: Missing or empty 'steps' array`);
        }
        if (!item.safetyDisclaimer) {
          errors.push(`Item #${itemNumber}: Missing safetyDisclaimer (Required for yoga injury safety)`);
        }

        // Check duplicate slug
        const slug = item.slug || `${item.sanskritName?.toLowerCase()}-${item.englishName?.toLowerCase()}`.replace(/\s+/g, '-');
        if (asanas.some(existing => existing.slug === slug)) {
          errors.push(`Item #${itemNumber}: Duplicate slug "${slug}" already exists in library`);
        }

        if (errors.length === 0) {
          validItems.push({
            id: item.id || `asana-import-${Date.now()}-${index}`,
            ...item,
            slug,
            editorialStatus: item.editorialStatus || 'draft'
          });
        }
      });

      if (errors.length > 0) {
        setImportValidationErrors(errors);
      } else {
        setImportParsedData(validItems);
        setImportPreviewCount(validItems.length);
      }
    } catch (err: any) {
      setImportValidationErrors([`Invalid JSON syntax: ${err.message}`]);
    }
  };

  const handleConfirmImport = () => {
    if (importParsedData && importParsedData.length > 0) {
      setAsanas(prev => [...importParsedData, ...prev]);
      showToast(`Successfully imported ${importParsedData.length} new asanas as Drafts for review.`);
      setIsImportModalOpen(false);
      setImportJsonText('');
      setImportParsedData(null);
      setImportPreviewCount(null);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(asanas, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `yogaconnect-asanas-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#263D32] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#A5B89A] flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-sage-900/60 p-6 sm:p-8 rounded-3xl border border-sage-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>EDITORIAL CONTENT MANAGEMENT</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-sand-50 mt-1">
            Yoga Asana Encyclopedia CMS
          </h2>
          <p className="text-xs text-sage-300 mt-1 max-w-xl">
            Manage postures, review classical Sanskrit etymology, update biomechanical instructions, assign certified Himalayan reviewers, and publish entries.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenEdit()}
            className="bg-gold-400 hover:bg-gold-500 text-sage-950 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Asana</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="bg-sage-800 hover:bg-sage-700 text-white font-medium text-xs px-3.5 py-2.5 rounded-xl transition flex items-center space-x-1.5 border border-sage-700 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-sand-200" />
            <span>Bulk JSON Import</span>
          </button>

          <button
            onClick={handleExportJson}
            className="bg-sage-800 hover:bg-sage-700 text-white font-medium text-xs px-3.5 py-2.5 rounded-xl transition flex items-center space-x-1.5 border border-sage-700 cursor-pointer"
            title="Export library as JSON backup"
          >
            <Download className="w-4 h-4 text-sand-200" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-sage-900/40 p-4 rounded-2xl border border-sage-800/80">
          <span className="text-sage-400 block font-medium">Total Library Poses</span>
          <span className="font-serif font-bold text-2xl text-sand-50 mt-1 block">{asanas.length}</span>
        </div>

        <div className="bg-sage-900/40 p-4 rounded-2xl border border-sage-800/80">
          <span className="text-emerald-400 block font-medium">Published Live</span>
          <span className="font-serif font-bold text-2xl text-emerald-300 mt-1 block">
            {asanas.filter(a => a.editorialStatus === 'published').length}
          </span>
        </div>

        <div className="bg-sage-900/40 p-4 rounded-2xl border border-sage-800/80">
          <span className="text-amber-400 block font-medium">Under Expert Review</span>
          <span className="font-serif font-bold text-2xl text-amber-300 mt-1 block">
            {asanas.filter(a => a.editorialStatus === 'under_review').length}
          </span>
        </div>

        <div className="bg-sage-900/40 p-4 rounded-2xl border border-sage-800/80">
          <span className="text-sage-300 block font-medium">Drafts in Progress</span>
          <span className="font-serif font-bold text-2xl text-sage-200 mt-1 block">
            {asanas.filter(a => a.editorialStatus === 'draft').length}
          </span>
        </div>
      </div>

      {/* Search & Status Filter Filter Bar */}
      <div className="bg-sage-900/40 p-4 rounded-2xl border border-sage-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-sage-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, Sanskrit, or slug..."
            className="w-full bg-sage-950 border border-sage-800 rounded-xl py-2 pl-9 pr-3 text-white placeholder:text-sage-500 text-xs focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <span className="text-sage-400 text-xs font-semibold">Status:</span>
          {['all', 'published', 'under_review', 'draft'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer capitalize ${
                statusFilter === status
                  ? 'bg-gold-400 text-sage-950 font-bold'
                  : 'bg-sage-800 text-sage-300 hover:text-white'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Asana CMS Data Table */}
      <div className="bg-sage-900/50 rounded-2xl border border-sage-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-sage-300">
            <thead className="bg-sage-950 text-sage-400 uppercase text-[10px] tracking-wider border-b border-sage-800">
              <tr>
                <th className="py-3 px-4">Asana / English Name</th>
                <th className="py-3 px-4">Sanskrit &amp; Devanagari</th>
                <th className="py-3 px-4">Category &amp; Level</th>
                <th className="py-3 px-4">Status &amp; Verification</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-800/60 font-light">
              {filteredAsanas.map(asana => (
                <tr key={asana.id} className="hover:bg-sage-800/40 transition">
                  <td className="py-3.5 px-4 font-medium text-sand-50">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={asana.coverImage} 
                        alt={asana.englishName} 
                        className="w-10 h-10 rounded-lg object-cover border border-sage-700 shrink-0"
                      />
                      <div>
                        <span className="font-serif font-bold text-sm block text-white">{asana.englishName}</span>
                        <span className="text-[11px] text-sage-400">/{asana.slug}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-sand-100 block">{asana.sanskritName}</span>
                    <span className="font-serif text-gold-400 text-xs block">{asana.sanskritDevanagari || '—'}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="bg-sage-800 text-sage-200 text-[10px] font-semibold px-2 py-0.5 rounded block w-fit mb-1">
                      {asana.category}
                    </span>
                    <span className="text-[11px] text-sage-400">{asana.difficulty}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={asana.editorialStatus}
                      onChange={(e) => handleStatusChange(asana.id, e.target.value as EditorialStatus)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md border focus:outline-none cursor-pointer ${
                        asana.editorialStatus === 'published'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : asana.editorialStatus === 'under_review'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      <option value="published">Published</option>
                      <option value="under_review">Under Review</option>
                      <option value="draft">Draft</option>
                    </select>
                    <span className="text-[10px] text-sage-400 block mt-1">
                      Updated: {asana.lastUpdatedDate || '2026-09-01'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs">
                    <span className="text-sand-100 font-medium block">{asana.reviewer.name}</span>
                    <span className="text-[10px] text-sage-400 block truncate max-w-[150px]">
                      {asana.reviewer.qualification}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedAsanaForPreview(asana)}
                      className="p-1.5 bg-sage-800 hover:bg-sage-700 text-sand-100 rounded-lg transition"
                      title="Quick Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(asana)}
                      className="p-1.5 bg-gold-400/20 hover:bg-gold-400 text-gold-300 hover:text-sage-950 rounded-lg transition"
                      title="Edit Asana"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Asana Modal */}
      {isEditModalOpen && editingAsana && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-sage-950 border border-sage-800 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sage-800 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-sand-50">
                  {editingAsana.id && asanas.some(a => a.id === editingAsana.id) ? 'Edit Asana Entry' : 'Create New Asana Entry'}
                </h3>
                <span className="text-xs text-sage-400">Manage 20 documentation fields &amp; safety safeguards</span>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-sage-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAsana} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sage-300 block mb-1">Sanskrit Name *</label>
                  <input
                    type="text"
                    required
                    value={editingAsana.sanskritName || ''}
                    onChange={e => setEditingAsana(prev => ({ ...prev, sanskritName: e.target.value }))}
                    placeholder="e.g. Vrikshasana"
                    className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-sage-300 block mb-1">Common English Name *</label>
                  <input
                    type="text"
                    required
                    value={editingAsana.englishName || ''}
                    onChange={e => setEditingAsana(prev => ({ ...prev, englishName: e.target.value }))}
                    placeholder="e.g. Tree Pose"
                    className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-sage-300 block mb-1">Devanagari Script</label>
                  <input
                    type="text"
                    value={editingAsana.sanskritDevanagari || ''}
                    onChange={e => setEditingAsana(prev => ({ ...prev, sanskritDevanagari: e.target.value }))}
                    placeholder="e.g. वृक्षासन"
                    className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white font-serif"
                  />
                </div>

                <div>
                  <label className="font-semibold text-sage-300 block mb-1">IAST Transliteration</label>
                  <input
                    type="text"
                    value={editingAsana.transliterationIast || ''}
                    onChange={e => setEditingAsana(prev => ({ ...prev, transliterationIast: e.target.value }))}
                    placeholder="e.g. Vṛkṣāsana"
                    className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-sage-300 block mb-1">Category / Body Position</label>
                  <select
                    value={editingAsana.category || 'Standing'}
                    onChange={e => setEditingAsana(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Standing">Standing</option>
                    <option value="Seated">Seated</option>
                    <option value="Forward Folds">Forward Folds</option>
                    <option value="Backbends">Backbends</option>
                    <option value="Twists">Twists</option>
                    <option value="Inversions">Inversions</option>
                    <option value="Arm Balances">Arm Balances</option>
                    <option value="Restorative">Restorative</option>
                    <option value="Meditation Postures">Meditation Postures</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-sage-300 block mb-1">Difficulty Level</label>
                  <select
                    value={editingAsana.difficulty || 'Beginner'}
                    onChange={e => setEditingAsana(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Adaptive & Supported">Adaptive &amp; Supported</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-sage-300 block mb-1">Sanskrit Etymology &amp; Meaning</label>
                <textarea
                  rows={2}
                  value={editingAsana.etymology || ''}
                  onChange={e => setEditingAsana(prev => ({ ...prev, etymology: e.target.value }))}
                  placeholder="Explain roots, e.g. From 'vṛkṣa' (tree) and 'āsana' (posture)..."
                  className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-sage-300 block mb-1">Short Description / Overview</label>
                <textarea
                  rows={2}
                  value={editingAsana.shortDescription || ''}
                  onChange={e => setEditingAsana(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Concise, authoritative summary of the pose..."
                  className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-sage-300 block mb-1">Safety Disclaimer *</label>
                <input
                  type="text"
                  required
                  value={editingAsana.safetyDisclaimer || ''}
                  onChange={e => setEditingAsana(prev => ({ ...prev, safetyDisclaimer: e.target.value }))}
                  className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sage-300 block mb-1">Editorial Status</label>
                  <select
                    value={editingAsana.editorialStatus || 'draft'}
                    onChange={e => setEditingAsana(prev => ({ ...prev, editorialStatus: e.target.value as any }))}
                    className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="under_review">Under Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-sage-300 block mb-1">Assigned Reviewer Name</label>
                  <input
                    type="text"
                    value={editingAsana.reviewer?.name || 'Acharya Vishwajeet Shastri'}
                    onChange={e => setEditingAsana(prev => {
                      if (!prev) return prev;
                      const currentReviewer = prev.reviewer || {
                        name: '',
                        qualification: 'E-RYT 500, Master of Classical Hatha',
                        traditionOrSchool: 'Parmarth Niketan Tradition, Rishikesh',
                        lastReviewedDate: new Date().toISOString().split('T')[0]
                      };
                      return {
                        ...prev,
                        reviewer: { ...currentReviewer, name: e.target.value }
                      };
                    })}
                    className="w-full bg-sage-900 border border-sage-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sage-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-sage-900 text-sage-300 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold-400 hover:bg-gold-500 text-sage-950 font-bold rounded-xl"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk JSON Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-sage-950 border border-sage-800 text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-sage-800 pb-3">
              <div className="flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif font-bold text-lg text-sand-50">
                  Bulk JSON Asana Importer
                </h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-sage-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-sage-300 leading-relaxed">
              Paste an array of YogaAsana JSON objects. The validator verifies required anatomical fields, duplicate slugs, and safety disclaimers before ingestion.
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder={`[\n  {\n    "sanskritName": "Kapotasana",\n    "englishName": "Pigeon Pose",\n    "safetyDisclaimer": "Avoid with acute knee injuries.",\n    "steps": [{ "stepNumber": 1, "title": "Setup", "instruction": "..." }]\n  }\n]`}
              className="w-full bg-sage-900 border border-sage-800 rounded-xl p-3 text-xs font-mono text-sand-100 placeholder:text-sage-600 focus:outline-none focus:border-gold-400"
            />

            {/* Validation Errors Display */}
            {importValidationErrors.length > 0 && (
              <div className="bg-rose-950/80 border border-rose-800 p-3.5 rounded-xl space-y-1 text-xs text-rose-200">
                <span className="font-bold flex items-center space-x-1.5 text-rose-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Validation Errors Detected:</span>
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-300/90 max-h-32 overflow-y-auto">
                  {importValidationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Preview Display */}
            {importPreviewCount !== null && (
              <div className="bg-emerald-950/80 border border-emerald-800 p-3.5 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
                <span>
                  Validated <strong>{importPreviewCount}</strong> asana record(s). Ready to import as Drafts.
                </span>
                <button
                  onClick={handleConfirmImport}
                  className="bg-emerald-500 hover:bg-emerald-400 text-sage-950 font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                >
                  Confirm Import
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-sage-800">
              <span className="text-[11px] text-sage-400">Never imports unverified records automatically.</span>
              <button
                onClick={handleValidateImport}
                className="bg-gold-400 hover:bg-gold-500 text-sage-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Validate JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Preview Modal */}
      {selectedAsanaForPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-sage-950 border border-sage-800 text-white rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-sage-800 pb-3">
              <div>
                <span className="text-xs text-gold-400 uppercase tracking-widest">{selectedAsanaForPreview.sanskritName}</span>
                <h3 className="font-serif font-bold text-xl text-sand-50">{selectedAsanaForPreview.englishName}</h3>
              </div>
              <button onClick={() => setSelectedAsanaForPreview(null)} className="text-sage-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <img 
              src={selectedAsanaForPreview.coverImage} 
              alt={selectedAsanaForPreview.englishName}
              className="w-full h-44 object-cover rounded-xl border border-sage-800"
            />

            <p className="text-xs text-sage-300 leading-relaxed">
              {selectedAsanaForPreview.shortDescription}
            </p>

            <div className="text-[11px] bg-sage-900 p-3 rounded-xl border border-sage-800 space-y-1">
              <div><strong>Category:</strong> {selectedAsanaForPreview.category} | <strong>Level:</strong> {selectedAsanaForPreview.difficulty}</div>
              <div><strong>Status:</strong> {selectedAsanaForPreview.editorialStatus} | <strong>Reviewer:</strong> {selectedAsanaForPreview.reviewer.name}</div>
            </div>

            <button
              onClick={() => setSelectedAsanaForPreview(null)}
              className="w-full bg-sage-800 hover:bg-sage-700 text-sand-100 font-medium py-2 rounded-xl text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
