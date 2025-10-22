'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Plus, BookOpen, Star } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: string;
  coverImage: string | null;
  genre: string | null;
  notes: string | null;
  rating: number | null;
  startedAt: string;
  completedAt: string | null;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    currentPage: '0',
    status: 'reading',
    genre: '',
    notes: '',
    rating: '',
  });
  const [progressData, setProgressData] = useState({
    pagesRead: '',
    notes: '',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          title: '',
          author: '',
          totalPages: '',
          currentPage: '0',
          status: 'reading',
          genre: '',
          notes: '',
          rating: '',
        });
        setShowForm(false);
        fetchBooks();
      }
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleProgressSubmit = async (bookId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData),
      });

      if (res.ok) {
        setProgressData({ pagesRead: '', notes: '' });
        setShowProgressForm(null);
        fetchBooks();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reading Tracker</h1>
          <p className="text-gray-600">Track your reading journey</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={20} />
          <span>Add Book</span>
        </button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., The Great Gatsby"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., F. Scott Fitzgerald"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Pages *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.totalPages}
                    onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Page
                  </label>
                  <input
                    type="number"
                    value={formData.currentPage}
                    onChange={(e) => setFormData({ ...formData, currentPage: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Fiction"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="reading">Reading</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Your thoughts about this book..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add Book
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-8 text-gray-500">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="col-span-full text-center py-8 text-gray-500">
            No books added yet. Start your reading journey!
          </p>
        ) : (
          books.map((book) => {
            const progress = getProgressPercentage(book.currentPage, book.totalPages);
            return (
              <Card key={book.id}>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{book.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          book.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : book.status === 'reading'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {book.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                    {book.genre && (
                      <p className="text-xs text-gray-500">{book.genre}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {book.currentPage} / {book.totalPages} pages
                    </p>
                  </div>

                  {book.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{book.notes}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-3">
                    Started: {formatDate(book.startedAt)}
                  </div>

                  {book.status !== 'completed' && (
                    <div>
                      {showProgressForm === book.id ? (
                        <div className="space-y-3 border-t pt-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pages Read
                            </label>
                            <input
                              type="number"
                              value={progressData.pagesRead}
                              onChange={(e) =>
                                setProgressData({ ...progressData, pagesRead: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notes (optional)
                            </label>
                            <textarea
                              value={progressData.notes}
                              onChange={(e) =>
                                setProgressData({ ...progressData, notes: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              rows={2}
                              placeholder="Session notes..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleProgressSubmit(book.id)}
                              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setShowProgressForm(null)}
                              className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowProgressForm(book.id)}
                          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                        >
                          <BookOpen size={16} />
                          <span>Update Progress</span>
                        </button>
                      )}
                    </div>
                  )}

                  {book.status === 'completed' && book.completedAt && (
                    <div className="text-sm text-green-600 font-semibold text-center">
                      Completed on {formatDate(book.completedAt)}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
