import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  BookOpen, 
  Clock, 
  Award, 
  Calendar, 
  Utensils, 
  Home, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

export const CourseDrawer: React.FC = () => {
  const { 
    isCourseDrawerOpen, 
    setIsCourseDrawerOpen, 
    selectedCourseId, 
    courses, 
    formatPrice,
    setIsBookingModalOpen
  } = useApp();

  if (!isCourseDrawerOpen || !selectedCourseId) return null;

  const course = courses.find(c => c.id === selectedCourseId);
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F7F5EE] w-full max-w-2xl h-full overflow-y-auto border-l border-[#E2E5DD] shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E2E5DD] bg-white/95 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase font-semibold tracking-wider text-[#536B50]">
              {course.centreName}
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32] leading-snug">
              {course.title}
            </h2>
          </div>

          <button 
            onClick={() => setIsCourseDrawerOpen(false)}
            className="p-2 text-[#59665C] hover:text-[#263D32] rounded-full hover:bg-[#E6EDE2] transition"
            aria-label="Close course drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 sm:p-8 space-y-8 flex-1 text-sm text-[#252C27]">
          
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-[#E2E5DD] shadow-sm text-center">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#59665C] block">Duration</span>
              <span className="font-serif font-bold text-lg text-[#263D32]">{course.durationDays} Days</span>
            </div>
            <div className="border-x border-[#E2E5DD]">
              <span className="text-[10px] uppercase font-semibold text-[#59665C] block">Accreditation</span>
              <span className="font-semibold text-xs text-[#536B50] block mt-1 truncate">{course.certification}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#59665C] block">Tuition Rate</span>
              <span className="font-serif font-bold text-lg text-[#263D32]">{formatPrice(course.priceUSD)}</span>
            </div>
          </div>

          {/* Subtitle / Overview */}
          <div className="bg-white p-5 rounded-xl border border-[#E2E5DD] space-y-2">
            <h3 className="font-serif font-bold text-base text-[#263D32]">Program Overview</h3>
            <p className="text-xs text-[#59665C] leading-relaxed">
              {course.subtitle}
            </p>
          </div>

          {/* Daily Schedule Timetable */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#536B50]" />
              <span>Sample Daily Himalayan Schedule</span>
            </h3>
            <div className="bg-white rounded-xl border border-[#E2E5DD] divide-y divide-[#E2E5DD]">
              {course.dailySchedule.map((sched, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#536B50] w-36">{sched.time}</span>
                  <span className="text-[#252C27] flex-1">{sched.activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Included Meals & Stay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E2E5DD] space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#263D32]">
                <Utensils className="w-4 h-4 text-[#536B50]" />
                <span>Sattvic Meals Included</span>
              </div>
              <p className="text-xs text-[#59665C]">{course.mealsIncluded}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E2E5DD] space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#263D32]">
                <Home className="w-4 h-4 text-[#536B50]" />
                <span>Accommodation Choices</span>
              </div>
              <p className="text-xs text-[#59665C]">{course.accommodationOptions.join(', ')}</p>
            </div>
          </div>

          {/* Syllabus Curriculum */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#536B50]" />
              <span>Full Curriculum Syllabus</span>
            </h3>
            <div className="bg-white p-5 rounded-xl border border-[#E2E5DD] space-y-2">
              {course.syllabus.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-[#252C27]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#536B50] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Dates */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#536B50]" />
              <span>Upcoming Residential Batches</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {course.upcomingDates.map((date, idx) => (
                <span key={idx} className="bg-white border border-[#E2E5DD] text-[#263D32] px-3 py-1.5 rounded-lg text-xs font-medium">
                  {date}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Footer Booking CTA */}
        <div className="p-6 border-t border-[#E2E5DD] bg-white sticky bottom-0 z-10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#59665C] block">Total Package</span>
            <span className="font-serif font-bold text-2xl text-[#263D32]">
              {formatPrice(course.priceUSD)}
            </span>
          </div>

          <button
            onClick={() => {
              setIsCourseDrawerOpen(false);
              setIsBookingModalOpen(true);
            }}
            className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium px-6 py-3 rounded-xl text-sm shadow-sm transition flex items-center space-x-2"
          >
            <span>Submit Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
