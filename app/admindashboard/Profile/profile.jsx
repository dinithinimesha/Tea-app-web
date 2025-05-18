import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function Profile() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        // Listen for session changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_, newSession) => {
          setSession(newSession);
        });

        // Cleanup listener on unmount
        return () => {
          authListener?.unsubscribe();
        };
      } catch (error) {
        setError('Failed to fetch session');
        console.error("Session error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfiles();
    }
  }, [session]);

  const fetchProfiles = async () => {
    if (!session?.user?.id) {
      setError('No user session found');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        console.error("Error fetching profiles:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!session) return <div>Please sign in to view your profile</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      
      {profiles.length === 0 ? (
        <p>No profile data found</p>
      ) : (
        <ul className="space-y-4">
          {profiles.map((profile) => (
            <li key={profile.id} className="border p-4 rounded">
              <p><strong>Name:</strong> {profile.full_name || 'Not set'}</p>
              <p><strong>Username:</strong> {profile.username || 'Not set'}</p>
              <p><strong>Email:</strong> {session?.user?.email || 'Not set'}</p>
              <p><strong>Phone:</strong> {profile.phonenumber || 'Not set'}</p>
              <p><strong>Address:</strong> {profile.address || 'Not set'}</p>
            </li>
          ))}
        </ul>
      )}
      
      <Link href="/admindashboard/Profile/Editprofile" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Edit Profile
      </Link>
    </div>
  );
}

export default Profile;