import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  UserRound,
  UsersRound,
} from "lucide-react";
import AppNav from "../components/AppNav";
import { getPublicUserProfile } from "../service/userService";

function normalizeSkills(skills) {
  if (Array.isArray(skills)) return skills.map((skill) => String(skill).trim()).filter(Boolean);
  if (typeof skills === "string") {
    return skills.split(/[,\n]/).map((skill) => skill.trim()).filter(Boolean);
  }
  return [];
}

export default function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const data = await getPublicUserProfile(userId);
        if (active) setProfile(data);
      } catch (err) {
        console.error("Public profile load failed:", err);
        if (active) setError("This profile could not be found or is currently unavailable.");
      } finally {
        if (active) setLoading(false);
      }
    }

    if (userId) loadProfile();
    else {
      setError("A profile ID is required.");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [userId]);

  const skills = useMemo(() => normalizeSkills(profile?.skills), [profile?.skills]);
  const role = String(profile?.role || "").toUpperCase();
  const isClient = role === "CLIENT";
  const name = profile?.name?.trim() || "Five2Nine member";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f6f8f5] text-[#1b332d]">
      <AppNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#527260] transition hover:text-[#197d68]">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        {loading ? (
          <div role="status" className="animate-pulse space-y-4">
            <div className="h-48 rounded-3xl bg-white" />
            <div className="h-56 rounded-3xl bg-white" />
            <span className="sr-only">Loading public profile...</span>
          </div>
        ) : error ? (
          <section role="alert" className="rounded-3xl border border-[#e3ebe3] bg-white p-8 text-center sm:p-12">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#edf4ee] text-[#47785b]"><UserRound size={24} /></div>
            <h1 className="mt-4 text-xl font-semibold">Profile unavailable</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7d8d83]">{error}</p>
            <Link to="/services" className="mt-6 inline-flex rounded-xl bg-[#197d68] px-5 py-3 text-sm font-semibold text-white hover:bg-[#146957]">Explore Five2Nine</Link>
          </section>
        ) : (
          <>
            <section className="overflow-hidden rounded-3xl border border-[#e2eae1] bg-white shadow-sm">
              <div className={`h-28 ${isClient ? "bg-gradient-to-r from-[#e5eafa] via-[#f5f6fc] to-white" : "bg-gradient-to-r from-[#d9eee0] via-[#f0f8f1] to-white"}`} />
              <div className="px-6 pb-7 sm:px-9">
                <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
                  <div className={`grid h-20 w-20 place-items-center rounded-2xl border-4 border-white text-2xl font-bold shadow-sm ${isClient ? "bg-[#e5eafa] text-[#5267a5]" : "bg-[#d9eee0] text-[#197d68]"}`}>
                    {initials || "F2"}
                  </div>
                  <span className={`mb-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${isClient ? "bg-[#edf0fc] text-[#5267a5]" : "bg-[#e7f5eb] text-[#287d61]"}`}>
                    {isClient ? <Building2 size={14} /> : <BriefcaseBusiness size={14} />}
                    {isClient ? "Client" : "Freelancer"}
                  </span>
                </div>
                <div className="mt-4">
                  <h1 className="font-display text-3xl font-medium tracking-[-0.04em]">{name}</h1>
                  {profile?.headline && <p className="mt-2 text-base font-medium text-[#526c5d]">{profile.headline}</p>}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#7d8d83]">
                    {profile?.location && <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{profile.location}</span>}
                    <span className="inline-flex items-center gap-1.5"><UsersRound size={15} />Five2Nine community</span>
                  </div>
                  {profile?.website && (
                    <a href={profile.website} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#197d68] hover:underline">
                      Visit website <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </section>

            <div className="mt-5 grid gap-5 md:grid-cols-[1fr_0.8fr]">
              <section className="rounded-3xl border border-[#e2eae1] bg-white p-6 sm:p-8">
                <h2 className="text-lg font-semibold">About</h2>
                {profile?.bio ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#63786a]">{profile.bio}</p>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[#8a988f]">This member hasn’t added an introduction yet.</p>
                )}

                {isClient && (profile?.companyName || profile?.companyRole || profile?.hiringFocus) && (
                  <div className="mt-7 border-t border-[#edf1ed] pt-6">
                    <h3 className="font-semibold">Hiring profile</h3>
                    {profile?.companyName && <p className="mt-3 text-sm text-[#63786a]"><span className="font-semibold text-[#345443]">Company:</span> {profile.companyName}</p>}
                    {profile?.companyRole && <p className="mt-2 text-sm text-[#63786a]"><span className="font-semibold text-[#345443]">Role:</span> {profile.companyRole}</p>}
                    {profile?.hiringFocus && <p className="mt-2 text-sm leading-6 text-[#63786a]"><span className="font-semibold text-[#345443]">Hiring focus:</span> {profile.hiringFocus}</p>}
                  </div>
                )}
              </section>

              <div className="space-y-5">
                {!isClient && (
                  <section className="rounded-3xl border border-[#e2eae1] bg-white p-6 sm:p-7">
                    <h2 className="text-lg font-semibold">Skills</h2>
                    {skills.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {skills.map((skill, index) => <span key={`${skill}-${index}`} className="rounded-full bg-[#edf5ee] px-3 py-1.5 text-xs font-semibold text-[#397356]">{skill}</span>)}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-[#8a988f]">Skills haven’t been added yet.</p>
                    )}
                    {profile?.experience && (
                      <div className="mt-6 border-t border-[#edf1ed] pt-5">
                        <h3 className="text-sm font-semibold">Experience</h3>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#63786a]">{profile.experience}</p>
                      </div>
                    )}
                  </section>
                )}

                <section className="rounded-3xl border border-[#e2eae1] bg-white p-6 sm:p-7">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf5ee] text-[#287d61]"><CheckCircle2 size={19} /></div>
                    <div>
                      <h2 className="font-semibold">Public profile</h2>
                      <p className="mt-1 text-sm leading-6 text-[#7d8d83]">Only information added to this profile is shown here. Email, password and private account details are not displayed.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
