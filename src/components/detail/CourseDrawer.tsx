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
  ArrowRight,
  Video
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
    <div className="fixed inset-0 z-50 flex justify-end bg-sage-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-sand-50 w-full max-w-2xl h-full overflow-y-auto border-l border-sand-300 shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-sand-300 bg-sand-50/95 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-600">
              {course.centreName}
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-sage-950 leading-snug">
              {course.title}
            </h2>
          </div>

          <button 
            onClick={() => setIsCourseDrawerOpen(false)}
            className="p-2 text-sage-500 hover:text-sage-900 rounded-full hover:bg-sand-200 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-8 flex-1 text-sm text-sage-900">
          
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-sand-300 shadow-sm text-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-sage-500 font-semibold block">Duration</span>
              <span className="font-serif font-bold text-lg text-sage-950 flex items-center justify-center space-x-1">
                <Clock className="w-4 h-4 text-terracotta-500" />
                <span>{course.durationDays} Days</span>
              </span>
            </div>

            <div className="border-x border-sand-200">
              <span className="text-[10px] uppercase tracking-wider text-sage-500 font-semibold block">Total Package</span>
              <span className="font-serif font-bold text-lg text-terracotta-600">
                {formatPrice(course.priceUSD)}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-sage-500 font-semibold block">Certification</span>
              <span className="text-xs font-bold text-sage-900 truncate block mt-1">
                Yoga Alliance RYS
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sage-700 italic border-l-2 border-terracotta-500 pl-3 py-1">
            "{course.subtitle}"
          </p>

          {/* Course Photos */}
          {course.photos && course.photos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-sage-950">Course Highlights & Facilities</h3>
              <div className="grid grid-cols-2 gap-3">
                {course.photos.map((img, i) => (
                  <img key={i} src={img} alt="Course" className="rounded-xl h-36 w-full object-cover shadow border border-sand-300" />
                ))}
              </div>
            </div>
          )}

          {/* Syllabus Curriculum */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-sage-950 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-terracotta-600" />
              <span>Curriculum & Core Modules</span>
            </h3>
            <ul className="space-y-2 bg-white p-4 rounded-xl border border-sand-300">
              {course.syllabus.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-sage-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Daily Schedule Timetable */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-sage-950 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-terracotta-600" />
              <span>Sample Daily Schedule</span>
            </h3>
            <div className="bg-white rounded-xl border border-sand-300 divide-y divide-sand-200">
              {course.dailySchedule.map((sched, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-sage-900 w-36 text-terracotta-600">{sched.time}</span>
                  <span className="text-sage-700 flex-1">{sched.activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Included Meals & Stay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-sand-300 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-sage-900">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <span>Sattvic Meals Included</span>
              </div>
              <p className="text-xs text-sage-600">{course.mealsIncluded}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-sand-300 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-sage-900">
                <Home className="w-4 h-4 text-amber-600" />
                <span>Accommodation Choices</span>
              </div>
              <p className="text-xs text-sage-600">{course.accommodationOptions.join(', ')}</p>
            </div>
          </div>

          {/* Upcoming Intake Dates */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-base text-sage-950 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-terracotta-600" />
              <span>Upcoming Intake Batches</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {course.upcomingDates.map((d, i) => (
                <span key={i} className="bg-sand-200 text-sage-900 text-xs font-semibold px-3 py-1.5 rounded-lg border border-sand-300">
                  {d}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Drawer Action Footer */}
        <div className="p-6 border-t border-sand-300 bg-sand-100 sticky bottom-0 z-10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-sage-500 font-bold block">Course Package Fee</span>
            <span className="font-serif font-bold text-2xl text-sage-950">{formatPrice(course.priceUSD)}</span>
          </div>

          <button
            onClick={() => {
              setIsCourseDrawerOpen(false);
              setIsBookingModalOpen(true);
            }}
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium px-6 py-3 rounded-xl text-sm shadow-lg transition flex items-center space-x-2"
          >
            <span>Submit Booking Request</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
