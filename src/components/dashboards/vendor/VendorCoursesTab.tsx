'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Clock, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  X, 
  Eye, 
  Sparkles,
  Layers
} from 'lucide-react';
import { Course, YogaCentre, BookingRequest } from '../../../types';

interface VendorCoursesTabProps {
  activeCentre: YogaCentre;
  courses: Course[];
  bookings: BookingRequest[];
  formatPrice: (amount: number) => string;
  onAddNewCourse: (course: Partial<Course>) => Promise<void>;
}

export const VendorCoursesTab: React.FC<VendorCoursesTabProps> = ({
  activeCentre,
  courses,
  bookings,
  formatPrice,
  onAddNewCourse
}) => {
  // Filter courses for this centre
  const myCourses = courses.filter(c => c.centreId === activeCentre.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'200h-ttc' | '300h-ttc' | 'meditation' | 'ayurveda'>('200h-ttc');
  const [priceUSD, setPriceUSD] = useState(1200);
  const [durationDays, setDurationDays] = useState(14);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNewCourse({
        title,
        category,
        priceUSD,
        durationDays,
        description,
        centreId: activeCentre.id,
        location: activeCentre.location,
        image: activeCentre.coverImage || activeCentre.image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
        certification: category === '200h-ttc' ? 'Yoga Alliance RYS-200' : category === '300h-ttc' ? 'Yoga Alliance RYS-300' : 'Ashram Certificate',
        features: ['Traditional Asana', 'Sanskrit & Philosophy', 'Daily Sattvic Meals', 'Accommodation Included']
      });

      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setPriceUSD(1200);
      setDurationDays(14);
    } catch (err: any) {
      alert(`Failed to add course: ${err.message || 'Error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E6EDE2] text-[#263D32]">
              Syllabus &amp; Curriculum
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-500">
              {myCourses.length} active listings
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#263D32] mt-1">
            Courses &amp; Retreat Packages
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Manage teacher training certifications, Ayurvedic Panchakarma immersions, and meditation retreats published under {activeCentre.name}.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2.5 bg-[#536B50] hover:bg-[#263D32] text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Publish New Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-[#E2E5DD] p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#F7F5EE] flex items-center justify-center mx-auto mb-3 text-gray-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#263D32]">No published packages yet</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
              Add your Yoga Alliance certified teacher training courses or retreats to start accepting global reservations.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#536B50] text-white rounded-xl text-xs font-bold inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Publish First Package
            </button>
          </div>
        ) : (
          myCourses.map(course => {
            const courseBookings = bookings.filter(b => b.courseId === course.id);
            const courseRevenue = courseBookings.reduce((sum, b) => sum + (b.totalPriceUSD || b.totalUSD || 0), 0);

            return (
              <div 
                key={course.id}
                className="bg-white rounded-2xl border border-[#E2E5DD] shadow-sm overflow-hidden flex flex-col hover:border-[#536B50]/60 transition-all group"
              >
                {/* Course Image */}
                <div className="h-44 bg-gray-100 relative overflow-hidden">
                  <img
                    src={course.image || (course.photos && course.photos[0]) || activeCentre.coverImage || activeCentre.image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#263D32]/90 backdrop-blur-md text-[#F7F5EE] border border-white/20">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#F7F5EE] text-[#263D32] shadow-md">
                      {formatPrice(course.priceUSD)}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#263D32] group-hover:text-[#536B50] transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {course.description || 'Comprehensive training immersion with certified yogic masters, pranayama, and accommodation.'}
                    </p>
                  </div>

                  {/* Badges / Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E2E5DD]">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-[#536B50]" />
                      <span>{course.durationDays} Days</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Award className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                      <span className="truncate">{course.certification || 'Yoga Alliance'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      <span>{courseBookings.length} Bookings</span>
                    </div>
                    <div className="flex items-center font-bold text-[#263D32]">
                      <DollarSign className="w-3.5 h-3.5 mr-0.5 text-emerald-600" />
                      <span>{formatPrice(courseRevenue)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedCourseDetail(course)}
                      className="w-full py-2 bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] rounded-xl text-xs font-bold border border-[#DCD6C8] transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> View Syllabus &amp; Dates
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#DCD6C8] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#263D32] text-white p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-serif font-bold text-[#F7F5EE]">
                Publish New Course / Package
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Listing will be linked to {activeCentre.name} and visible to travelers globally.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#263D32] block mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 200-Hour Ashtanga &amp; Vinyasa Flow TTC"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                />
              </div>

              <div>
                <label className="font-bold text-[#263D32] block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                >
                  <option value="200h-ttc">200-Hour Yoga Teacher Training</option>
                  <option value="300h-ttc">300-Hour Advanced TTC</option>
                  <option value="meditation">Meditation &amp; Mindfulness Retreat</option>
                  <option value="ayurveda">Ayurvedic Healing &amp; Detox</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#263D32] block mb-1">Price (USD)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#263D32] block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#263D32] block mb-1">Course Description &amp; Highlights</label>
                <textarea
                  rows={3}
                  placeholder="Outline the daily schedule, curriculum topics, lodging, and included meals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-medium border border-[#DCD6C8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#536B50] hover:bg-[#263D32] text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourseDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#DCD6C8] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#263D32] text-white p-6 relative">
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="absolute top-5 right-5 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#536B50] text-[#F7F5EE]">
                {selectedCourseDetail.category}
              </span>
              <h3 className="text-xl font-serif font-bold text-[#F7F5EE] mt-1">
                {selectedCourseDetail.title}
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                {selectedCourseDetail.durationDays} Days • {formatPrice(selectedCourseDetail.priceUSD)}
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Curriculum &amp; Overview</label>
                <p className="text-gray-700 bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                  {selectedCourseDetail.description || 'Authentic holistic curriculum covering asanas, pranayama, anatomy, yogic philosophy, and meditation practice.'}
                </p>
              </div>

              {selectedCourseDetail.features && (
                <div>
                  <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">What's Included</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCourseDetail.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center text-gray-700 bg-white p-2 rounded-lg border border-[#E2E5DD]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#F7F5EE] px-6 py-4 border-t border-[#E2E5DD] flex justify-end">
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="px-5 py-2 bg-white text-[#263D32] hover:bg-gray-100 rounded-xl text-xs font-bold border border-[#DCD6C8]"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
