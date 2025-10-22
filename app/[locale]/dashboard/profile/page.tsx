'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { User, Mail, Calendar, Activity, BookOpen, FileText, Edit2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  _count: {
    exercises: number;
    books: number;
    posts: number;
  };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${session?.user?.id}`);
      const data = await res.json();
      setProfile(data);
      setFormData({
        name: data.name,
        bio: data.bio || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Edit2 size={18} />
          <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-24 h-24 flex items-center justify-center">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <User size={48} className="text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
              <p className="text-gray-600 flex items-center space-x-2">
                <Mail size={16} />
                <span>{profile.email}</span>
              </p>
              <p className="text-gray-600 flex items-center space-x-2 mt-1">
                <Calendar size={16} />
                <span>Joined {formatDate(profile.createdAt)}</span>
              </p>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-gray-700">
                {profile.bio || 'No bio yet. Click "Edit Profile" to add one!'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="text-blue-600" size={32} />
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-2">{profile._count.exercises}</p>
            <p className="text-gray-600">Total Exercises</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-green-600" size={32} />
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{profile._count.books}</p>
            <p className="text-gray-600">Books Tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-8">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-purple-600" size={32} />
            </div>
            <p className="text-4xl font-bold text-purple-600 mb-2">{profile._count.posts}</p>
            <p className="text-gray-600">Posts Shared</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">User ID</span>
              <span className="font-mono text-sm">{profile.id}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Email</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Member Since</span>
              <span>{formatDate(profile.createdAt)}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Total Activity</span>
              <span className="font-semibold">
                {profile._count.exercises + profile._count.books + profile._count.posts} items
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
