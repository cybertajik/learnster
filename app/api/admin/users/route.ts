import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wjpebwftwbhlcankgrms.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET() {
  try {
    if (!serviceRoleKey) {
      return NextResponse.json({ success: true, users: [], message: 'Service Role Key not configured' });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Fetch users from Supabase Auth admin API
    const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
    
    // 2. Fetch progress records from Supabase user_progress table
    const { data: progressData } = await supabaseAdmin
      .from('user_progress')
      .select('*');

    const authUsers = authData?.users || [];
    const progressRecords = progressData || [];

    const usersMap: Record<string, any> = {};

    authUsers.forEach((u) => {
      const username = u.user_metadata?.username || u.email?.split('@')[0] || u.id;
      usersMap[username.toLowerCase()] = {
        username: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        created: u.created_at,
        email: u.email,
        device: 'Web Client',
        country: 'United States',
        countryFlag: '🇺🇸',
        ip: '127.0.0.1',
        totalTries: 0,
        correctTries: 0,
        incorrectTries: 0,
      };
    });

    progressRecords.forEach((p) => {
      const uId = p.user_id;
      const matchingAuthUser = authUsers.find((u) => u.id === uId);
      const username = matchingAuthUser?.user_metadata?.username || matchingAuthUser?.email?.split('@')[0] || uId;
      const key = username.toLowerCase();

      if (!usersMap[key]) {
        usersMap[key] = {
          username: username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          created: p.updated_at || new Date().toISOString(),
          device: 'Web Client',
          country: 'United States',
          countryFlag: '🇺🇸',
          ip: '127.0.0.1',
          totalTries: p.total_questions || 0,
          correctTries: p.correct || 0,
          incorrectTries: p.incorrect || 0,
        };
      } else {
        usersMap[key].totalTries = p.total_questions || 0;
        usersMap[key].correctTries = p.correct || 0;
        usersMap[key].incorrectTries = p.incorrect || 0;
      }
    });

    return NextResponse.json({
      success: true,
      users: Object.values(usersMap),
      totalSupabaseUsers: authUsers.length,
      totalProgressRecords: progressRecords.length,
    });
  } catch (err: any) {
    console.error('Error fetching admin users route:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
