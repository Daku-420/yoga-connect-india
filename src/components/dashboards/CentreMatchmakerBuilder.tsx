import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { YogaCentre } from '../../types';
import { 
  CentreMatchmakerConfig, 
  MatchmakerQuestion, 
  AnswerOption, 
  QuestionType 
} from '../../types/matchmaker';
import { PREDEFINED_QUESTION_TEMPLATES } from '../../data/mockMatchmakers';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Eye, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Users, 
  TrendingUp, 
  Calendar, 
  Mail, 
  Phone, 
  FileText, 
  Check, 
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  ShieldAlert
} from 'lucide-react';

interface CentreMatchmakerBuilderProps {
  centre: YogaCentre;
}

export const CentreMatchmakerBuilder: React.FC<CentreMatchmakerBuilderProps> = ({ centre }) => {
  const { 
    matchmakerConfigs, 
    saveCentreMatchmakerConfig, 
    matchmakerLeads, 
    matchmakerAnalytics,
    openCentreMatchmaker,
    formatPrice
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'builder' | 'leads' | 'analytics'>('builder');
  
  // Local working copy of the centre's configuration
  const currentConfig: CentreMatchmakerConfig = matchmakerConfigs[centre.id] || {
    id: `mm-${centre.id}`,
    centreId: centre.id,
    centreName: centre.name,
    isEnabled: false,
    status: 'draft',
    title: `Find Your Perfect ${centre.name.split(' ')[0]} Journey`,
    description: `Answer a few questions to discover the classes and retreats at ${centre.name} that best suit your preferences.`,
    customWelcomeMessage: `Welcome to ${centre.name}. Let us find your ideal practice.`,
    version: 1,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    questions: []
  };

  const [localConfig, setLocalConfig] = useState<CentreMatchmakerConfig>(currentConfig);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Sync if centre changes
  React.useEffect(() => {
    if (matchmakerConfigs[centre.id]) {
      setLocalConfig(matchmakerConfigs[centre.id]);
    }
  }, [centre.id, matchmakerConfigs]);

  const centreLeads = matchmakerLeads.filter(l => l.centreId === centre.id);
  const centreAnalytics = matchmakerAnalytics[centre.id] || {
    centreId: centre.id,
    startsCount: 0,
    completionsCount: 0,
    topGoals: [],
    popularStyles: [],
    requestedExperienceLevels: [],
    topRecommendedOfferings: [],
    enquiriesCount: 0
  };

  const conversionRate = centreAnalytics.completionsCount > 0
    ? ((centreLeads.length / centreAnalytics.completionsCount) * 100).toFixed(1)
    : '0.0';

  const handleSave = (status: 'draft' | 'published' | 'deactivated') => {
    const updated: CentreMatchmakerConfig = {
      ...localConfig,
      status,
      isEnabled: status === 'published',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      version: localConfig.version + 1
    };
    setLocalConfig(updated);
    saveCentreMatchmakerConfig(updated);
    setSaveSuccessMsg(status === 'published' ? 'Questionnaire published live!' : 'Draft saved successfully.');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const questions = [...localConfig.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const temp = questions[index];
    questions[index] = questions[targetIndex];
    questions[targetIndex] = temp;

    // re-index order
    questions.forEach((q, idx) => { q.order = idx + 1; });
    setLocalConfig(prev => ({ ...prev, questions }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    const questions = localConfig.questions.filter(q => q.id !== questionId);
    questions.forEach((q, idx) => { q.order = idx + 1; });
    setLocalConfig(prev => ({ ...prev, questions }));
    if (editingQuestionId === questionId) setEditingQuestionId(null);
  };

  const handleAddTemplate = (template: typeof PREDEFINED_QUESTION_TEMPLATES[0]) => {
    const newQuestion: MatchmakerQuestion = {
      ...template,
      id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      order: localConfig.questions.length + 1
    };
    setLocalConfig(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setIsTemplateModalOpen(false);
  };

  const handleAddCustomQuestion = () => {
    const newQuestion: MatchmakerQuestion = {
      id: `q-custom-${Date.now()}`,
      text: 'Custom Question Title',
      subtitle: 'Optional helper text for your visitors',
      type: 'single_choice',
      required: true,
      order: localConfig.questions.length + 1,
      options: [
        { id: `opt-${Date.now()}-1`, label: 'Option 1', description: 'Description for option 1' },
        { id: `opt-${Date.now()}-2`, label: 'Option 2', description: 'Description for option 2' }
      ]
    };
    setLocalConfig(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setEditingQuestionId(newQuestion.id);
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<MatchmakerQuestion>) => {
    setLocalConfig(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === questionId ? { ...q, ...updates } : q)
    }));
  };

  const handleAddOption = (questionId: string) => {
    const targetQ = localConfig.questions.find(q => q.id === questionId);
    if (!targetQ) return;

    const newOpt: AnswerOption = {
      id: `opt-${Date.now()}`,
      label: `New Option ${(targetQ.options?.length || 0) + 1}`,
      description: ''
    };
    handleUpdateQuestion(questionId, {
      options: [...(targetQ.options || []), newOpt]
    });
  };

  const handleUpdateOption = (questionId: string, optionId: string, updates: Partial<AnswerOption>) => {
    const targetQ = localConfig.questions.find(q => q.id === questionId);
    if (!targetQ) return;

    handleUpdateQuestion(questionId, {
      options: targetQ.options.map(opt => opt.id === optionId ? { ...opt, ...updates } : opt)
    });
  };

  const handleDeleteOption = (questionId: string, optionId: string) => {
    const targetQ = localConfig.questions.find(q => q.id === questionId);
    if (!targetQ) return;

    handleUpdateQuestion(questionId, {
      options: targetQ.options.filter(opt => opt.id !== optionId)
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E2E5DD] shadow-sm overflow-hidden space-y-6">
      
      {/* Top Section Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#263D32] to-[#1E3228] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-[#DCCDB5] text-[#263D32] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Centre Feature Suite
            </span>
            <span className="text-xs text-[#A5B89A]">
              v{localConfig.version}.0 • Last Updated {localConfig.updatedAt}
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-white">
            Yoga Matchmaker Settings
          </h2>
          <p className="text-xs text-[#A5B89A]">
            Configure your personalized recommendation questionnaire to match international travelers directly to {centre.name}’s actual classes and retreats.
          </p>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {localConfig.adminDisabled ? (
            <span className="bg-red-950 text-red-200 border border-red-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Admin Policy Override</span>
            </span>
          ) : (
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 ${
              localConfig.status === 'published' 
                ? 'bg-[#E6EDE2] text-[#263D32] border-[#A5B89A]' 
                : localConfig.status === 'draft'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-stone-100 text-stone-700 border-stone-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                localConfig.status === 'published' ? 'bg-[#286749]' : 'bg-amber-500'
              }`} />
              <span className="capitalize">{localConfig.status}</span>
            </span>
          )}

          <button
            onClick={() => openCentreMatchmaker(centre.id)}
            className="bg-white/10 hover:bg-white/20 text-[#DCCDB5] hover:text-white border border-white/20 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Interactive Preview</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="px-6 sm:px-8 border-b border-[#E2E5DD] flex space-x-6 text-xs font-semibold text-[#59665C]">
        {[
          { id: 'builder', label: `Questionnaire Builder (${localConfig.questions.length} Questions)`, icon: Sliders },
          { id: 'leads', label: `Captured Leads & Enquiries (${centreLeads.length})`, icon: Users },
          { id: 'analytics', label: 'Matchmaker Analytics', icon: TrendingUp },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-3.5 transition border-b-2 font-medium flex items-center space-x-2 ${
                activeSubTab === tab.id
                  ? 'border-[#536B50] text-[#536B50] font-bold'
                  : 'border-transparent text-[#59665C] hover:text-[#263D32]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {saveSuccessMsg && (
        <div className="mx-6 sm:mx-8 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* SUB-TAB 1: QUESTIONNAIRE BUILDER */}
      {activeSubTab === 'builder' && (
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* General Matchmaker Settings */}
          <div className="bg-[#F7F5EE] p-6 rounded-2xl border border-[#E2E5DD] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#263D32]">
              General Matchmaker Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-[#252C27] block mb-1">
                  Questionnaire Title
                </label>
                <input
                  type="text"
                  value={localConfig.title}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 border border-[#E2E5DD] rounded-xl text-xs bg-white focus:border-[#536B50] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#252C27] block mb-1">
                  Supporting Subtitle
                </label>
                <input
                  type="text"
                  value={localConfig.description}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 border border-[#E2E5DD] rounded-xl text-xs bg-white focus:border-[#536B50] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#252C27] block mb-1 text-xs">
                Custom Welcome Message (Shown to Visitors)
              </label>
              <input
                type="text"
                value={localConfig.customWelcomeMessage || ''}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, customWelcomeMessage: e.target.value }))}
                className="w-full p-2.5 border border-[#E2E5DD] rounded-xl text-xs bg-white focus:border-[#536B50] outline-none"
              />
            </div>

            {/* Enable / Disable Controls */}
            <div className="pt-3 border-t border-[#E2E5DD] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    const newEnabled = !localConfig.isEnabled;
                    setLocalConfig(prev => ({
                      ...prev,
                      isEnabled: newEnabled,
                      status: newEnabled ? 'published' : 'deactivated'
                    }));
                  }}
                  className="flex items-center space-x-2 text-xs font-semibold text-[#263D32]"
                >
                  {localConfig.isEnabled ? (
                    <ToggleRight className="w-7 h-7 text-[#536B50]" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-[#59665C]" />
                  )}
                  <span>Matchmaker Enabled on Public Profile</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSave('draft')}
                  className="bg-white hover:bg-stone-50 border border-[#E2E5DD] text-[#263D32] text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
                >
                  Save as Draft
                </button>

                <button
                  onClick={() => handleSave('published')}
                  className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Questionnaire</span>
                </button>
              </div>
            </div>
          </div>

          {/* Question Sequence Builder */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#263D32]">
                  Configured Questions ({localConfig.questions.length})
                </h3>
                <p className="text-xs text-[#59665C]">
                  Reorder, customize questions, set required rules, or add answer options.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="bg-[#E6EDE2] hover:bg-[#D4E2CE] text-[#263D32] text-xs font-semibold px-3.5 py-2 rounded-xl transition border border-[#A5B89A]/50 flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4 text-[#536B50]" />
                  <span>Add from Templates</span>
                </button>

                <button
                  onClick={handleAddCustomQuestion}
                  className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-sm flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Custom Question</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {localConfig.questions.map((question, qIdx) => {
                const isEditing = editingQuestionId === question.id;

                return (
                  <div
                    key={question.id}
                    className={`bg-white rounded-2xl border transition-all ${
                      isEditing 
                        ? 'border-[#536B50] ring-1 ring-[#536B50]/30 shadow-md' 
                        : 'border-[#E2E5DD] hover:border-[#A5B89A]'
                    }`}
                  >
                    {/* Question Summary Row */}
                    <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start space-x-3.5">
                        <span className="w-7 h-7 rounded-full bg-[#E6EDE2] text-[#263D32] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#F7F5EE] border border-[#E2E5DD] text-[#59665C]">
                              {question.type.replace('_', ' ')}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              question.required ? 'bg-red-50 text-red-700' : 'bg-stone-100 text-stone-600'
                            }`}>
                              {question.required ? 'Required' : 'Optional'}
                            </span>
                            <span className="text-xs text-[#59665C]">
                              ({question.options?.length || 0} answer options)
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-base text-[#263D32]">
                            {question.text}
                          </h4>
                          {question.subtitle && (
                            <p className="text-xs text-[#59665C]">
                              {question.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controls: Reorder, Edit, Delete */}
                      <div className="flex items-center space-x-1.5 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => handleMoveQuestion(qIdx, 'up')}
                          disabled={qIdx === 0}
                          className="p-1.5 rounded-lg border border-[#E2E5DD] hover:bg-[#F7F5EE] disabled:opacity-30 transition text-[#59665C]"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveQuestion(qIdx, 'down')}
                          disabled={qIdx === localConfig.questions.length - 1}
                          className="p-1.5 rounded-lg border border-[#E2E5DD] hover:bg-[#F7F5EE] disabled:opacity-30 transition text-[#59665C]"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingQuestionId(isEditing ? null : question.id)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                            isEditing 
                              ? 'bg-[#536B50] text-white border-[#536B50]' 
                              : 'bg-[#F7F5EE] text-[#263D32] border-[#E2E5DD] hover:bg-[#E6EDE2]'
                          }`}
                        >
                          {isEditing ? 'Close Editor' : 'Edit Question & Options'}
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Editor for Question & Options */}
                    {isEditing && (
                      <div className="p-6 bg-[#F7F5EE]/60 border-t border-[#E2E5DD] space-y-6 text-xs animate-fade-in">
                        
                        {/* Question Text & Subtitle Form */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-3">
                            <div>
                              <label className="font-bold text-[#252C27] block mb-1">
                                Question Heading
                              </label>
                              <input
                                type="text"
                                value={question.text}
                                onChange={(e) => handleUpdateQuestion(question.id, { text: e.target.value })}
                                className="w-full p-2.5 border border-[#E2E5DD] rounded-xl bg-white outline-none focus:border-[#536B50]"
                              />
                            </div>
                            <div>
                              <label className="font-bold text-[#252C27] block mb-1">
                                Subtitle / Instructions
                              </label>
                              <input
                                type="text"
                                value={question.subtitle || ''}
                                onChange={(e) => handleUpdateQuestion(question.id, { subtitle: e.target.value })}
                                className="w-full p-2.5 border border-[#E2E5DD] rounded-xl bg-white outline-none focus:border-[#536B50]"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="font-bold text-[#252C27] block mb-1">
                                Question Type
                              </label>
                              <select
                                value={question.type}
                                onChange={(e) => handleUpdateQuestion(question.id, { type: e.target.value as QuestionType })}
                                className="w-full p-2.5 border border-[#E2E5DD] rounded-xl bg-white outline-none focus:border-[#536B50] cursor-pointer"
                              >
                                <option value="single_choice">Single Choice</option>
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="dropdown">Dropdown</option>
                                <option value="budget_range">Budget Range</option>
                                <option value="duration_selection">Duration Selection</option>
                                <option value="experience_level">Experience Level</option>
                                <option value="date_selection">Date Selection</option>
                                <option value="short_text">Short Text Response</option>
                              </select>
                            </div>

                            <div className="pt-2">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={question.required}
                                  onChange={(e) => handleUpdateQuestion(question.id, { required: e.target.checked })}
                                  className="rounded border-[#E2E5DD] text-[#536B50] focus:ring-[#536B50]"
                                />
                                <span className="font-bold text-[#252C27]">
                                  Mark as Mandatory Question
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Options Editor */}
                        {question.type !== 'short_text' && (
                          <div className="space-y-3 pt-3 border-t border-[#E2E5DD]">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs uppercase tracking-wider text-[#263D32]">
                                Configured Answer Options ({question.options?.length || 0})
                              </span>
                              <button
                                onClick={() => handleAddOption(question.id)}
                                className="bg-white border border-[#E2E5DD] hover:bg-[#F7F5EE] text-[#536B50] font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Option</span>
                              </button>
                            </div>

                            <div className="space-y-2">
                              {question.options?.map((opt, optIdx) => (
                                <div 
                                  key={opt.id}
                                  className="bg-white p-3.5 rounded-xl border border-[#E2E5DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                                >
                                  <div className="flex items-start space-x-2.5 flex-1">
                                    <span className="text-[10px] text-[#59665C] font-mono mt-2">
                                      {optIdx + 1}.
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                                      <input
                                        type="text"
                                        placeholder="Option Label"
                                        value={opt.label}
                                        onChange={(e) => handleUpdateOption(question.id, opt.id, { label: e.target.value })}
                                        className="p-1.5 border border-[#E2E5DD] rounded-lg text-xs outline-none focus:border-[#536B50]"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Description (optional)"
                                        value={opt.description || ''}
                                        onChange={(e) => handleUpdateOption(question.id, opt.id, { description: e.target.value })}
                                        className="p-1.5 border border-[#E2E5DD] rounded-lg text-xs outline-none focus:border-[#536B50]"
                                      />
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteOption(question.id, opt.id)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    title="Delete option"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LEADS & INQUIRIES */}
      {activeSubTab === 'leads' && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#263D32]">
                Questionnaire Leads & Inquiries ({centreLeads.length})
              </h3>
              <p className="text-xs text-[#59665C]">
                Travelers who completed your matchmaker and requested to connect regarding recommended experiences.
              </p>
            </div>
          </div>

          {centreLeads.length === 0 ? (
            <div className="bg-[#F7F5EE] p-10 rounded-2xl border border-[#E2E5DD] text-center space-y-2">
              <span className="text-3xl">🧘</span>
              <h4 className="font-serif font-bold text-lg text-[#263D32]">
                No Enquiries Yet
              </h4>
              <p className="text-xs text-[#59665C] max-w-sm mx-auto">
                Once travelers complete your questionnaire and submit an inquiry, their responses and contacts will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {centreLeads.map((lead) => (
                <div 
                  key={lead.id}
                  className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E5DD] pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#E6EDE2] text-[#263D32]">
                        {lead.referenceCode}
                      </span>
                      <strong className="text-sm text-[#263D32]">{lead.customerName}</strong>
                      <span className="text-xs text-[#59665C]">• {lead.createdAt}</span>
                    </div>

                    <span className="bg-[#F7F5EE] border border-[#E2E5DD] text-[#536B50] text-[11px] font-bold px-3 py-0.5 rounded-full capitalize">
                      Status: {lead.status}
                    </span>
                  </div>

                  {/* Customer Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F7F5EE] p-4 rounded-xl border border-[#E2E5DD] text-xs">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-[#536B50]" />
                      <span>{lead.customerEmail}</span>
                    </div>
                    {lead.customerWhatsApp && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-[#536B50]" />
                        <span>{lead.customerWhatsApp}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-[#536B50]" />
                      <span>Dates: {lead.preferredDates || 'Flexible'}</span>
                    </div>
                  </div>

                  {/* Recommended Offering Matched */}
                  <div className="p-3 bg-[#E6EDE2]/50 rounded-xl border border-[#A5B89A]/30 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#59665C] uppercase font-bold block">Recommended Offering:</span>
                      <strong className="font-serif text-[#263D32] text-sm">{lead.recommendedCourseTitle}</strong>
                    </div>
                    <span className="text-xs font-bold text-[#536B50]">
                      {lead.participantsCount} Participant(s)
                    </span>
                  </div>

                  {/* Customer Message */}
                  {lead.message && (
                    <div className="text-xs text-[#59665C] bg-white p-3 rounded-lg border border-[#E2E5DD] italic">
                      "{lead.message}"
                    </div>
                  )}

                  {/* Full Questionnaire Answers Summary */}
                  <details className="text-xs pt-1">
                    <summary className="font-semibold text-[#536B50] cursor-pointer hover:underline">
                      View Traveler's Questionnaire Responses ({Object.keys(lead.rawAnswers).length} answers)
                    </summary>
                    <div className="mt-2 p-3 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] space-y-1 font-mono text-[11px] text-[#252C27]">
                      {Object.entries(lead.rawAnswers).map(([qKey, val]) => (
                        <div key={qKey} className="flex justify-between border-b border-[#E2E5DD]/50 py-1">
                          <span className="text-[#59665C]">{qKey}:</span>
                          <span className="font-bold">{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#F7F5EE] p-5 rounded-2xl border border-[#E2E5DD] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#59665C] block">Questionnaire Starts</span>
              <span className="font-serif font-bold text-3xl text-[#263D32]">{centreAnalytics.startsCount}</span>
              <span className="text-[10px] text-[#59665C] block">Visitors who opened quiz</span>
            </div>

            <div className="bg-[#F7F5EE] p-5 rounded-2xl border border-[#E2E5DD] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#59665C] block">Completed Quizzes</span>
              <span className="font-serif font-bold text-3xl text-[#536B50]">{centreAnalytics.completionsCount}</span>
              <span className="text-[10px] text-[#59665C] block">Finished all steps</span>
            </div>

            <div className="bg-[#F7F5EE] p-5 rounded-2xl border border-[#E2E5DD] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#59665C] block">Direct Enquiries</span>
              <span className="font-serif font-bold text-3xl text-[#286749]">{centreLeads.length}</span>
              <span className="text-[10px] text-[#59665C] block">High intent leads captured</span>
            </div>

            <div className="bg-[#F7F5EE] p-5 rounded-2xl border border-[#E2E5DD] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#59665C] block">Enquiry Conversion Rate</span>
              <span className="font-serif font-bold text-3xl text-[#263D32]">{conversionRate}%</span>
              <span className="text-[10px] text-[#59665C] block">Enquiries / Completions</span>
            </div>
          </div>

          {/* Demographic & Demand Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Goals */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-lg text-[#263D32]">
                Top Traveler Intentions & Goals
              </h4>
              <div className="space-y-3">
                {centreAnalytics.topGoals.map((item, idx) => {
                  const maxCount = Math.max(...centreAnalytics.topGoals.map(g => g.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);

                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#263D32]">{item.goal}</span>
                        <span className="text-[#536B50] font-bold">{item.count} travelers</span>
                      </div>
                      <div className="w-full bg-[#F7F5EE] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#536B50] h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Yoga Styles */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-lg text-[#263D32]">
                Most Requested Yoga Styles
              </h4>
              <div className="space-y-3">
                {centreAnalytics.popularStyles.map((item, idx) => {
                  const maxCount = Math.max(...centreAnalytics.popularStyles.map(s => s.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);

                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#263D32]">{item.style}</span>
                        <span className="text-[#536B50] font-bold">{item.count} inquiries</span>
                      </div>
                      <div className="w-full bg-[#F7F5EE] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#263D32] h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Top Recommended Offerings */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-lg text-[#263D32]">
              Most Frequently Recommended Offerings
            </h4>
            <div className="space-y-2">
              {centreAnalytics.topRecommendedOfferings.map((offering, idx) => (
                <div key={idx} className="p-3.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <strong className="font-serif font-bold text-sm text-[#263D32]">{offering.title}</strong>
                    <span className="text-[11px] text-[#59665C] block">Program ID: {offering.courseId}</span>
                  </div>
                  <span className="bg-[#E6EDE2] text-[#263D32] font-bold px-3 py-1 rounded-full text-xs">
                    Recommended {offering.count} times
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Modal: Add from Predefined Templates */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263D32]/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E2E5DD] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center border-b border-[#E2E5DD] pb-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#263D32]">
                  Select Predefined Question Template
                </h3>
                <p className="text-xs text-[#59665C]">
                  Curated questions pre-configured with matching attributes for yoga retreats.
                </p>
              </div>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-[#59665C] hover:text-[#252C27]">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {PREDEFINED_QUESTION_TEMPLATES.map((tmpl, tIdx) => (
                <div 
                  key={tIdx} 
                  className="p-4 rounded-xl border border-[#E2E5DD] hover:border-[#536B50] hover:bg-[#F7F5EE] transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#536B50] px-2 py-0.5 rounded bg-[#E6EDE2]">
                      {tmpl.type.replace('_', ' ')}
                    </span>
                    <h5 className="font-serif font-bold text-sm text-[#263D32]">
                      {tmpl.text}
                    </h5>
                    {tmpl.subtitle && (
                      <p className="text-xs text-[#59665C]">{tmpl.subtitle}</p>
                    )}
                    <span className="text-[11px] text-[#59665C] block">
                      Includes {tmpl.options.length} pre-configured answer options
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddTemplate(tmpl)}
                    className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2 rounded-xl transition shrink-0"
                  >
                    Insert Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
