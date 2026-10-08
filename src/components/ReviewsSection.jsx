import React, { useState } from 'react';
import { 
  Star, 
  Camera, 
  Video, 
  Upload, 
  Plus, 
  CheckCircle2, 
  ThumbsUp, 
  X, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function ReviewsSection({ 
  reviews = [], 
  onReviewAdded,
  destinations = [] 
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    destination: destinations[0]?.name || 'Shimla & Manali',
    packageTitle: 'Go Orbit Holiday',
    rating: 5,
    comment: '',
    videoUrl: ''
  });
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPhotos([...selectedPhotos, ...files]);

    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removePhoto = (index) => {
    const newFiles = [...selectedPhotos];
    newFiles.splice(index, 1);
    setSelectedPhotos(newFiles);

    const newPrevs = [...photoPreviews];
    newPrevs.splice(index, 1);
    setPhotoPreviews(newPrevs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('userName', newReview.userName || 'Go Orbit Traveler');
      formData.append('destination', newReview.destination);
      formData.append('packageTitle', newReview.packageTitle);
      formData.append('rating', newReview.rating);
      formData.append('comment', newReview.comment);
      formData.append('videoUrl', newReview.videoUrl);

      selectedPhotos.forEach(file => {
        formData.append('photos', file);
      });

      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        onReviewAdded(data.review);
        setModalOpen(false);
        // Reset
        setNewReview({
          userName: '',
          destination: destinations[0]?.name || 'Shimla & Manali',
          packageTitle: 'Go Orbit Holiday',
          rating: 5,
          comment: '',
          videoUrl: ''
        });
        setSelectedPhotos([]);
        setPhotoPreviews([]);
      }
    } catch (err) {
      console.error('Submit review error:', err);
      alert('Could not submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Real Experiences from Travelers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
              Trip Reviews, Photos & Videos
            </h2>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{avgRating} out of 5</span>
              <span className="text-xs text-slate-500">({reviews.length} Verified Customer Reviews)</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 md:mt-0 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 self-start md:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Upload Trip Photos & Write Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">No Traveler Reviews Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
              We are excited to hear your travel stories! Book your first trip with Go Orbit, explore incredible destinations, and share your photos and reviews here.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center space-x-2 py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Write the First Review</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200/90 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* User & Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{rev.userName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {rev.destination} • {rev.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {/* Attached Trip Photos */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1">
                      <Camera className="w-3 h-3 text-blue-500" />
                      <span>Traveler Photos ({rev.photos.length})</span>
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {rev.photos.map((photo, pIdx) => (
                        <a
                          key={pIdx}
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                          className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs group relative"
                        >
                          <img
                            src={photo}
                            alt="Traveler upload"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Video Embed */}
                {rev.videoUrl && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1 mb-1.5">
                      <Video className="w-3 h-3 text-rose-500" />
                      <span>Trip Video</span>
                    </span>
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
                      <iframe
                        src={rev.videoUrl}
                        title="Traveler trip video"
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>

              {/* Verified Traveler Badge & Likes */}
              <div className="pt-4 border-t border-slate-200/80 mt-4 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center space-x-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Go Orbit Traveler</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rev.likes || 0} helpful</span>
                </span>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Modal: Write Review & Upload Photos/Videos */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-heading">
                    Share Your Trip Memories
                  </h3>
                  <p className="text-[11px] text-slate-500">Post photos, videos & rating from your journey</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={newReview.userName}
                  onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Trip Destination</label>
                <select
                  value={newReview.destination}
                  onChange={(e) => setNewReview({ ...newReview, destination: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.category.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rating</label>
                <div className="flex space-x-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-slate-600 font-bold ml-2">{newReview.rating} Stars</span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Trip Experience & Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell fellow travelers about the sightseeing, food, transfers, and your favorite moment..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Photo Upload Area */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Upload Trip Photos (Multiple allowed)
                </label>
                <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition-colors">
                  <Upload className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="font-bold text-slate-700">Click to select photos</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG up to 10MB each</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>

                {/* Previews */}
                {photoPreviews.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pt-2">
                    {photoPreviews.map((src, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <img src={src} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Trip Video Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/embed/... or MP4 link"
                  value={newReview.videoUrl}
                  onChange={(e) => setNewReview({ ...newReview, videoUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{submitting ? 'Uploading Media...' : 'Post Review & Photos'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
