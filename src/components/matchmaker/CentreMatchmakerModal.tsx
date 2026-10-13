import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchmakerQuestion, AnswerOption } from '../../types/matchmaker';
import { generateCentreRecommendations } from '../../utils/matchmakerEngine';
import { MatchmakerResultsView } from './MatchmakerResultsView';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  HelpCircle,
  Building2
} from 'lucide-react';

export const CentreMatchmakerModal: React.FC = () => {
  const { 
    isMatchmakerModalOpen, 
    closeCentreMatchmaker, 
    matchmakerCentreId, 
    matchmakerConfigs, 
    centres, 
    courses,
    recordMatchmakerCompletion
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validationError, setValidationError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset state when opening for a new centre
  useEffect(() => {
    if (isMatchmakerModalOpen) {
      setCurrentStepIndex(0);
      setAnswers({});
      setValidationError('');
      setIsCompleted(false);
    }
  }, [isMatchmakerModalOpen, matchmakerCentreId]);

  if (!isMatchmakerModalOpen || !matchmakerCentreId) {
    return null;
  }

  const centre = centres.find(c => c.id === matchmakerCentreId);
  const config = matchmakerConfigs[matchmakerCentreId];

  if (!centre) {
    return null;
  }

  // Check if disabled by admin or inactive
  const isAvailable = config && config.isEnabled && config.status === 'published' && !config.adminDisabled;

  // Filter out questions that have unmet conditional requirements
  const activeQuestions: MatchmakerQuestion[] = config ? config.questions.filter((q) => {
    if (!q.conditionalOnQuestionId || !q.conditionalOnOptionId) return true;
    const priorAnswer = answers[q.conditionalOnQuestionId];
    if (Array.isArray(priorAnswer)) {
      return priorAnswer.includes(q.conditionalOnOptionId);
    }
    return priorAnswer === q.conditionalOnOptionId;
  }) : [];

  const currentQuestion: MatchmakerQuestion | undefined = activeQuestions[currentStepIndex];
  const totalSteps = activeQuestions.length;
  const progressPercent = totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0;

  const handleOptionSelect = (optionId: string, isMulti: boolean) => {
    setValidationError('');
    if (!currentQuestion) return;

    if (isMulti) {
      const currentSelected: string[] = answers[currentQuestion.id] || [];
      const updated = currentSelected.includes(optionId)
        ? currentSelected.filter(id => id !== optionId)
        : [...currentSelected, optionId];
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: updated }));
    } else {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    }
  };

  const handleNext = () => {
    if (!currentQuestion) return;

    // Check required validation
    if (currentQuestion.required) {
      const currentAns = answers[currentQuestion.id];
      const isEmpty = currentAns === undefined || currentAns === null || 
        (Array.isArray(currentAns) && currentAns.length === 0) || 
        (typeof currentAns === 'string' && currentAns.trim() === '');

      if (isEmpty) {
        setValidationError('Please select or enter an answer to continue.');
        return;
      }
    }

    setValidationError('');

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Completed! Compute recommendations and record completion
      const centreCourses = courses.filter(c => c.centreId === centre.id);
      const { recommendations } = generateCentreRecommendations(centreCourses, config, answers);
      const topCourseId = recommendations[0]?.course.id;
      recordMatchmakerCompletion(centre.id, answers, topCourseId);
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Render question inputs
  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const currentAns = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map(opt => {
              const selectedList: string[] = currentAns || [];
              const isSelected = selectedList.includes(opt.id);

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleOptionSelect(opt.id, true)}
                  className={`text-left p-4 rounded-xl border transition-all flex items-start space-x-3 ${
                    isSelected 
                      ? 'bg-[#E6EDE2] border-[#536B50] ring-1 ring-[#536B50]' 
                      : 'bg-[#F7F5EE]/60 border-[#E2E5DD] hover:bg-[#F7F5EE] hover:border-[#A5B89A]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition ${
                    isSelected ? 'bg-[#536B50] border-[#536B50] text-white' : 'border-[#A5B89A] bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-semibold text-[#263D32] block leading-snug">
                      {opt.label}
                    </strong>
                    {opt.description && (
                      <p className="text-[11px] text-[#59665C] leading-tight">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'dropdown':
        return (
          <div className="max-w-md mx-auto space-y-2">
            <select
              value={currentAns || ''}
              onChange={(e) => {
                setValidationError('');
                setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }));
              }}
              className="w-full p-3.5 border border-[#E2E5DD] rounded-xl text-xs font-medium text-[#252C27] bg-white focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none"
            >
              <option value="">Select an option...</option>
              {currentQuestion.options.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'short_text':
        return (
          <div className="max-w-lg mx-auto space-y-2">
            <textarea
              rows={4}
              placeholder="Enter your notes, health context, or specific questions here..."
              value={currentAns || ''}
              onChange={(e) => {
                setValidationError('');
                setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }));
              }}
              className="w-full p-3.5 border border-[#E2E5DD] rounded-xl text-xs text-[#252C27] focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none"
            />
          </div>
        );

      case 'single_choice':
      case 'budget_range':
      case 'duration_selection':
      case 'experience_level':
      default:
        return (
          <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto">
            {currentQuestion.options.map(opt => {
              const isSelected = currentAns === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleOptionSelect(opt.id, false)}
                  className={`text-left p-4 rounded-xl border transition-all flex items-start space-x-3 ${
                    isSelected 
                      ? 'bg-[#E6EDE2] border-[#536B50] ring-1 ring-[#536B50]' 
                      : 'bg-[#F7F5EE]/60 border-[#E2E5DD] hover:bg-[#F7F5EE] hover:border-[#A5B89A]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border transition ${
                    isSelected ? 'bg-[#536B50] border-[#536B50] text-white' : 'border-[#A5B89A] bg-white'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <strong className="text-xs font-semibold text-[#263D32] block leading-snug">
                      {opt.label}
                    </strong>
                    {opt.description && (
                      <p className="text-[11px] text-[#59665C] leading-tight">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        );
    }
  };

  const centreCourses = courses.filter(c => c.centreId === centre.id);
  const recommendationResults = isCompleted
    ? generateCentreRecommendations(centreCourses, config, answers)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263D32]/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-[#E2E5DD] shadow-2xl relative max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col justify-between">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={centre.coverImage} 
              alt={centre.name} 
              className="w-10 h-10 rounded-lg object-cover border border-[#E2E5DD]" 
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#536B50]">
                  Official Centre Matchmaker
                </span>
                <span className="text-[10px] text-[#59665C]">({centre.city})</span>
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#263D32]">
                {centre.name}
              </h2>
            </div>
          </div>

          <button
            onClick={closeCentreMatchmaker}
            className="text-[#59665C] hover:text-[#252C27] bg-[#F7F5EE] p-2 rounded-full transition"
            aria-label="Close matchmaker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Available or Admin Disabled State */}
        {!isAvailable ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#263D32]">
              Matchmaker Currently Unavailable
            </h3>
            <p className="text-xs text-[#59665C] max-w-md mx-auto leading-relaxed">
              {config?.adminDisabled 
                ? config.adminDisabledReason || 'This questionnaire has been temporarily paused by platform administration.'
                : `${centre.name} has not currently published an active matchmaker questionnaire.`}
            </p>
            <button
              onClick={closeCentreMatchmaker}
              className="bg-[#536B50] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#40563E] transition"
            >
              Return to Ashram Profile
            </button>
          </div>
        ) : isCompleted && recommendationResults ? (
          /* Personalized Results View */
          <div className="py-4">
            <MatchmakerResultsView
              centre={centre}
              recommendations={recommendationResults.recommendations}
              summaryMessage={recommendationResults.summaryMessage}
              hasExactMatch={recommendationResults.hasExactMatch}
              needsContactCentre={recommendationResults.needsContactCentre}
              userAnswers={answers}
              onModifyAnswers={() => {
                setIsCompleted(false);
                setCurrentStepIndex(0);
              }}
              onClose={closeCentreMatchmaker}
            />
          </div>
        ) : (
          /* Multi-step Question View */
          <div className="py-6 space-y-6 flex-1 flex flex-col justify-between">
            
            {/* Progress Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#59665C]">
                <span>Question {currentStepIndex + 1} of {totalSteps}</span>
                <span>{progressPercent}% Completed</span>
              </div>
              <div className="w-full bg-[#E6EDE2] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#536B50] h-full transition-all duration-300 rounded-full" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            {currentQuestion && (
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="inline-flex items-center space-x-1.5 bg-[#E6EDE2]/60 text-[#263D32] px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-[#A5B89A]/30">
                    <Sparkles className="w-3 h-3 text-[#536B50]" />
                    <span>Step {currentStepIndex + 1} • {currentQuestion.required ? 'Required' : 'Optional'}</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32] leading-snug">
                    {currentQuestion.text}
                  </h3>
                  {currentQuestion.subtitle && (
                    <p className="text-xs text-[#59665C]">
                      {currentQuestion.subtitle}
                    </p>
                  )}
                </div>

                {/* Input Fields */}
                <div className="pt-2">
                  {renderQuestionInput()}
                </div>

                {validationError && (
                  <p className="text-xs text-red-600 text-center font-medium animate-fade-in">
                    {validationError}
                  </p>
                )}
              </div>
            )}

            {/* Bottom Controls */}
            <div className="pt-6 border-t border-[#E2E5DD] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl border transition ${
                  currentStepIndex === 0 
                    ? 'opacity-40 cursor-not-allowed border-transparent text-[#59665C]' 
                    : 'border-[#E2E5DD] hover:bg-[#F7F5EE] text-[#263D32]'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-sm transition inline-flex items-center space-x-2"
              >
                <span>{currentStepIndex === totalSteps - 1 ? 'See Recommendations' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
