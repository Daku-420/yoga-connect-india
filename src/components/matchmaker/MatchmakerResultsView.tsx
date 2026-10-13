import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { YogaCentre } from '../../types';
import { RecommendationScore } from '../../types/matchmaker';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  Award, 
  MapPin, 
  Send, 
  RotateCcw, 
  AlertCircle,
  Eye,
  Calendar,
  Utensils,
  Home,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { MatchmakerEnquiryModal } from './MatchmakerEnquiryModal';

interface MatchmakerResultsViewProps {
  centre: YogaCentre;
  recommendations: RecommendationScore[];
  summaryMessage: string;
  hasExactMatch: boolean;
  needsContactCentre: boolean;
  userAnswers: Record<string, any>;
  onModifyAnswers: () => void;
  onClose: () => void;
}

export const MatchmakerResultsView: React.FC<MatchmakerResultsViewProps> = ({
  centre,
  recommendations,
  summaryMessage,
  hasExactMatch,
  needsContactCentre,
  userAnswers,
  onModifyAnswers,
  onClose
}) => {
  const { 
    formatPrice, 
    setSelectedCourseId, 
    setIsCourseDrawerOpen,
    setIsChatOpen
  } = useApp();

  const [selectedForEnquiry, setSelectedForEnquiry] = useState<RecommendationScore | null>(null);

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Best Match':
        return 'bg-[#263D32] text-[#F7F5EE] border-[#3D5E4C]';
      case 'Best for Beginners':
        return 'bg-[#E6EDE2] text-[#263D32] border-[#A5B89A]';
      case 'Best for Meditation':
        return 'bg-[#DCCDB5] text-[#263D32] border-[#C5A77C]';
      case 'Best Within Your Budget':
        return 'bg-[#F4F7F3] text-[#286749] border-[#286749]/30';
      default:
        return 'bg-[#F7F5EE] text-[#59665C] border-[#E2E5DD]';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#252C27]">
      {/* Header Banner branded with Centre */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E5DD] shadow-sm bg-[#263D32] text-white p-6 sm:p-8">
        <div className="absolute inset-0 opacity-15">
          <img 
            src={centre.coverImage} 
            alt={centre.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#A5B89A]/40 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#536B50]" />
              <span>Personalized Centre Recommendation</span>
            </span>
            <span className="text-xs text-[#DCCDB5] font-medium">
              {centre.city}, Uttarakhand
            </span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            Recommended for You at {centre.name}
          </h2>

          <p className="text-sm text-[#A5B89A] leading-relaxed">
            {summaryMessage}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onModifyAnswers}
              className="inline-flex items-center space-x-1.5 text-xs text-[#DCCDB5] hover:text-white transition bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Modify Your Preferences</span>
            </button>
            <span className="text-[11px] text-[#A5B89A]/80">
              Generated from {centre.name}’s actual active offerings.
            </span>
          </div>
        </div>
      </div>

      {/* When no offerings exist or insufficient info */}
      {needsContactCentre && (
        <div className="bg-white p-8 rounded-2xl border border-[#E2E5DD] shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F7F5EE] border border-[#E2E5DD] flex items-center justify-center mx-auto text-[#536B50]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#263D32]">
            Custom Inquiry Needed
          </h3>
          <p className="text-xs text-[#59665C] max-w-md mx-auto leading-relaxed">
            Based on your customized dates or requirements, our admissions team can organize a bespoke personal sadhana or advise on future intake schedules.
          </p>
          <button
            onClick={() => {
              onClose();
              setIsChatOpen(true);
            }}
            className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium text-xs px-6 py-3 rounded-xl transition inline-flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Ashram Coordinator</span>
          </button>
        </div>
      )}

      {/* Alternative match warning banner if no 100% exact match */}
      {!hasExactMatch && recommendations.length > 0 && (
        <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#DCCDB5] flex items-start space-x-3 text-xs text-[#59665C]">
          <AlertCircle className="w-4 h-4 text-[#C5A77C] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#263D32] block font-serif">Closest Suitable Alternatives</strong>
            <span>
              Your exact combined duration, budget, and style didn't find an identical match, but the programs below from {centre.name} represent the nearest match with minimal difference in duration or focus.
            </span>
          </div>
        </div>
      )}

      {/* Recommended Offerings Cards */}
      <div className="space-y-6">
        {recommendations.map((rec, index) => {
          const { course, score, matchReasons, badges, isAlternative } = rec;
          const isTopMatch = index === 0 && score >= 70;

          return (
            <div 
              key={course.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                isTopMatch 
                  ? 'border-[#536B50] ring-1 ring-[#536B50]/30' 
                  : 'border-[#E2E5DD]'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                
                {/* Course Photo & Badges */}
                <div className="md:col-span-4 relative h-52 md:h-auto min-h-[220px]">
                  <img 
                    src={course.photos[0] || centre.coverImage} 
                    alt={course.title}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {badges.map((badge, bIdx) => (
                      <span 
                        key={bIdx}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${getBadgeStyle(badge)}`}
                      >
                        {badge}
                      </span>
                    ))}
                    {isAlternative && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-amber-50 text-amber-900 border-amber-200">
                        Alternative Option
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 bg-[#263D32]/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
                    {course.durationDays} Days Duration
                  </div>
                </div>

                {/* Course Details & Match Reasoning */}
                <div className="md:col-span-8 p-6 sm:p-7 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E5DD] pb-3">
                      <span className="bg-[#E6EDE2] text-[#263D32] text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block">
                        {course.certification}
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] text-[#59665C] uppercase font-semibold block">Total Package</span>
                        <span className="font-serif font-bold text-2xl text-[#263D32]">
                          {formatPrice(course.priceUSD)}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32] leading-tight">
                      {course.title}
                    </h3>

                    <p className="text-xs text-[#59665C] leading-relaxed">
                      {course.subtitle}
                    </p>

                    {/* Match Reasoning Box */}
                    <div className="bg-[#F7F5EE] p-3.5 rounded-xl border border-[#E2E5DD] space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#536B50] flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#286749]" />
                        <span>Why this matches your questionnaire:</span>
                      </span>
                      <ul className="space-y-1 text-xs text-[#252C27]">
                        {matchReasons.map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-start space-x-2">
                            <span className="text-[#536B50] font-bold">•</span>
                            <span className="leading-snug">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#59665C] pt-1">
                      <div className="flex items-center space-x-1.5">
                        <Utensils className="w-3.5 h-3.5 text-[#536B50] shrink-0" />
                        <span className="truncate">{course.mealsIncluded}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Home className="w-3.5 h-3.5 text-[#536B50] shrink-0" />
                        <span className="truncate">{course.accommodationOptions[0] || 'Ashram Room'}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#536B50] shrink-0" />
                        <span className="truncate">Upcoming Intakes Listed</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#E2E5DD] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setIsCourseDrawerOpen(true);
                      }}
                      className="w-full sm:w-auto text-xs font-semibold text-[#536B50] hover:text-[#263D32] transition flex items-center justify-center space-x-1 py-2 px-3 rounded-lg border border-[#E2E5DD] hover:bg-[#F7F5EE]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full Daily Schedule & Syllabus</span>
                    </button>

                    <button
                      onClick={() => setSelectedForEnquiry(rec)}
                      className="w-full sm:w-auto bg-[#536B50] hover:bg-[#40563E] text-white font-medium text-xs px-6 py-3 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enquire Directly with {centre.name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Confidence Note */}
      <div className="bg-[#E6EDE2]/50 p-4 rounded-xl border border-[#A5B89A]/40 flex items-center justify-between text-xs text-[#263D32]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#286749] shrink-0" />
          <span>
            <strong>Need personalized advice?</strong> Our admissions coordinator can answer questions about visa timing, private airport pickup, or diet.
          </span>
        </div>
        <button
          onClick={() => {
            onClose();
            setIsChatOpen(true);
          }}
          className="underline font-semibold text-[#536B50] hover:text-[#263D32] shrink-0 ml-4"
        >
          Chat with Support
        </button>
      </div>

      {/* Enquiry Modal */}
      {selectedForEnquiry && (
        <MatchmakerEnquiryModal
          centre={centre}
          recommendedCourse={selectedForEnquiry.course}
          userAnswers={userAnswers}
          onClose={() => setSelectedForEnquiry(null)}
        />
      )}
    </div>
  );
};
