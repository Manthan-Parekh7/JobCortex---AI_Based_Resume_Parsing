import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Mail } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import useFetch from '../../hooks/useFetch';
import { searchCandidatesApi } from '../../api/recruiterApi';

const SkillPill = ({ children }) => (
    <Badge variant="outline" className="text-xs mr-1 mb-1">{children}</Badge>
);

const CandidateCard = ({ c }) => {
    const initials = c?.username?.charAt(0)?.toUpperCase() || 'U';
    const topSkills = (c?.skills || []).slice(0, 6);
    return (
        <Card className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={c?.image} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{c?.username || 'Unknown'}</h3>
                            {c?.location && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {c.location}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><Mail className="h-3 w-3" /> {c?.email}</p>
                        {topSkills.length > 0 && (
                            <div className="mt-2 flex flex-wrap -m-0.5">
                                {topSkills.map((s, i) => (
                                    <SkillPill key={i}>{typeof s === 'string' ? s : s?.name}</SkillPill>
                                ))}
                                {c.skills?.length > topSkills.length && (
                                    <Badge variant="outline" className="text-xs">+{c.skills.length - topSkills.length} more</Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {c.summary && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{c.summary}</p>
                )}
                <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                        <a href={`mailto:${c.email}`}>Contact</a>
                    </Button>
                    {c.resume && (
                        <Button size="sm" variant="outline" asChild>
                            <a href={c.resume} target="_blank" rel="noreferrer">Resume</a>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const FindCandidates = () => {
    const [q, setQ] = useState('');
    const [skills, setSkills] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const { execute: searchCandidates, data: searchData } = useFetch(searchCandidatesApi);

    useEffect(() => {
        // initial search
        searchCandidates({ q: '', skills: '', page: 1, limit });
    }, [searchCandidates, limit]);

    const candidates = searchData?.candidates || [];
    const totalPages = searchData?.totalPages || 1;

    const onSearch = () => {
        setPage(1);
        searchCandidates({ q, skills, page: 1, limit });
    };

    const onPrev = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            searchCandidates({ q, skills, page: newPage, limit });
        }
    };

    const onNext = () => {
        if (page < totalPages) {
            const newPage = page + 1;
            setPage(newPage);
            searchCandidates({ q, skills, page: newPage, limit });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Find Candidates</h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, summary..." className="pl-10" />
                </div>
                <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Filter by skills (comma separated)" />
                <Button onClick={onSearch}>Search</Button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidates.map((c) => (
                    <CandidateCard key={c._id} c={c} />
                ))}
            </div>

            <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onPrev} disabled={page <= 1}>Previous</Button>
                    <Button variant="outline" onClick={onNext} disabled={page >= totalPages}>Next</Button>
                </div>
            </div>
        </div>
    );
};

export default FindCandidates;
