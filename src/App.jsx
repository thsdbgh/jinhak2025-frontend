import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Alert, Chip, CircularProgress, Divider } from '@mui/material'
import {
    CalendarMonth,
    AccessTime,
    Place,
    Campaign,
    Info,
    CheckCircle,
    HelpOutline,
    Phone,
    Groups,
} from '@mui/icons-material'

// --- 설정(필요하면 수정) ---
const SITE = {
    title: '2025 진학설명회',
    dateText: '2025년 10월 30일(수) 19:00',
    locationText: '본관 5층 대강당',
    host: '광희중학교',
    capacity: '선착순 400명',
    mapEmbedSrc:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!...', // 실제 주소로 바꾸세요(없어도 동작)
    contact: {
        phone: '02-123-4567',
        person: '진로진학부',
    },
}

// (선택) 간단한 일정 타임라인 데이터
const AGENDA = [
    { time: '18:30', title: '입장 & 등록', desc: '현장 확인 및 자료 배포' },
    { time: '19:00', title: '개회 및 안내', desc: '행사 소개' },
    { time: '19:10', title: '대입/고입 핵심 전략', desc: '전형 개요/변동사항' },
    { time: '20:00', title: '질의응답', desc: '교사/진로진학부 질의응답' },
    { time: '20:30', title: '폐회', desc: '마무리 안내' },
]

// FAQ 데이터
const FAQS = [
    {
        q: '누가 참석할 수 있나요?',
        a: '학생, 학부모 모두 참석 가능합니다. 좌석이 한정되어 선착순으로 운영됩니다.',
    },
    {
        q: '신청은 어떻게 하나요?',
        a: '상단 또는 공지 카드의 “신청하기” 버튼을 클릭해 간단히 정보를 입력하면 됩니다.',
    },
    { q: '주차가 가능한가요?', a: '본관 주차장이 협소하므로 대중교통 이용을 권장드립니다.' },
]

// 공지사항 읽기
function useNotices() {
    const API_BASE = import.meta.env.VITE_API_BASE
    const url = useMemo(() => `${API_BASE}/notices`, [API_BASE])
    const [state, setState] = useState({ loading: true, data: [], error: null })

    useEffect(() => {
        let alive = true
        ;(async () => {
            try {
                const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json()
                if (alive) setState({ loading: false, data, error: null })
            } catch (e) {
                if (alive) setState({ loading: false, data: [], error: e.message })
            }
        })()
        return () => (alive = false)
    }, [url])

    return state
}

// 공용 버튼
function PrimaryButton({ to, children }) {
    return (
        <Link
            to={to}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow hover:bg-indigo-700 transition"
        >
            {children}
        </Link>
    )
}

// 설명 페이지(홈)
function InfoPage() {
    const { loading, data, error } = useNotices()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더/히어로 */}
            <header className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                <div className="mx-auto max-w-6xl px-5 py-10 sm:py-16">
                    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
                                <Campaign fontSize="small" />
                                <span>학교 주최 공식 행사</span>
                            </div>
                            <h1 className="text-3xl font-extrabold sm:text-5xl">{SITE.title}</h1>
                            <p className="mt-3 text-white/90">
                                {SITE.host} 주최, 선착순 {SITE.capacity}. 아래에서 일정과 공지를 확인하세요.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Chip icon={<CalendarMonth />} label={SITE.dateText} color="default" className="!bg-white !text-indigo-700 !font-semibold" />
                                <Chip icon={<Place />} label={SITE.locationText} className="!bg-white !text-indigo-700 !font-semibold" />
                            </div>
                        </div>
                        <PrimaryButton to="/register">신청하기</PrimaryButton>
                    </div>
                </div>
            </header>

            {/* 핵심 정보 카드 */}
            <section className="mx-auto max-w-6xl px-5 -mt-8">
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <div className="mb-2 flex items-center gap-2 text-indigo-600">
                            <CalendarMonth /><span className="font-bold">일시</span>
                        </div>
                        <div className="text-gray-800">{SITE.dateText}</div>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <div className="mb-2 flex items-center gap-2 text-indigo-600">
                            <Place /><span className="font-bold">장소</span>
                        </div>
                        <div className="text-gray-800">{SITE.locationText}</div>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <div className="mb-2 flex items-center gap-2 text-indigo-600">
                            <Groups /><span className="font-bold">정원</span>
                        </div>
                        <div className="text-gray-800">{SITE.capacity}</div>
                    </div>
                </div>
            </section>

            {/* 일정 타임라인 */}
            <section className="mx-auto mt-10 max-w-6xl px-5">
                <h2 className="mb-4 text-2xl font-bold">진행 일정</h2>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <ol className="relative border-s-2 border-dashed border-indigo-200 ps-6">
                        {AGENDA.map((a, idx) => (
                            <li key={idx} className="mb-6 last:mb-0">
                                <span className="absolute -start-2.5 mt-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600"></span>
                                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                    <AccessTime fontSize="inherit" /> {a.time}
                  </span>
                                    <span className="text-lg font-semibold">{a.title}</span>
                                </div>
                                <div className="ps-0.5 text-gray-600">{a.desc}</div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* 공지사항 */}
            <section className="mx-auto mt-10 max-w-6xl px-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">공지사항</h2>
                    <PrimaryButton to="/register">신청하기</PrimaryButton>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    {loading && (
                        <div className="flex items-center gap-3 text-gray-500">
                            <CircularProgress size={20} /> 불러오는 중…
                        </div>
                    )}
                    {error && <Alert severity="warning">공지 불러오기 실패: {error}</Alert>}
                    {!loading && !error && data.length === 0 && (
                        <Alert severity="info">등록된 공지가 없습니다.</Alert>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {data.map((n) => (
                            <article key={n.id} className="rounded-xl border border-gray-100 p-4 hover:shadow-sm transition">
                                <div className="mb-2 flex items-center gap-2">
                                    {n.pinned && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      <CheckCircle fontSize="inherit" /> 상단 고정
                    </span>
                                    )}
                                    <span className="text-sm text-gray-500">{new Date(n.created_at).toLocaleString()}</span>
                                </div>
                                <h3 className="mb-1 text-lg font-bold">{n.title}</h3>
                                <p className="text-gray-700 whitespace-pre-line">{n.content}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="mx-auto mt-10 max-w-6xl px-5">
                <h2 className="mb-4 text-2xl font-bold">자주 묻는 질문</h2>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    {FAQS.map((f, i) => (
                        <details key={i} className="group border-b last:border-none">
                            <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                                <div className="flex items-center gap-2 font-semibold">
                                    <HelpOutline className="!text-indigo-600" /> {f.q}
                                </div>
                                <span className="text-indigo-600 transition group-open:rotate-180">⌄</span>
                            </summary>
                            <div className="pb-4 text-gray-700">{f.a}</div>
                        </details>
                    ))}
                </div>
            </section>

            {/* 오시는 길 */}
            <section className="mx-auto mt-10 max-w-6xl px-5">
                <h2 className="mb-4 text-2xl font-bold">오시는 길</h2>
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    {SITE.mapEmbedSrc?.includes('google.com/maps') ? (
                        <iframe
                            src={SITE.mapEmbedSrc}
                            width="100%" height="360" loading="lazy" allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade" title="map"
                        />
                    ) : (
                        <div className="p-6 text-gray-600">
                            지도 임베드 URL을 설정하면 이 영역에 지도가 표시됩니다.
                        </div>
                    )}
                </div>
            </section>

            {/* 문의 */}
            <section className="mx-auto mt-10 max-w-6xl px-5">
                <h2 className="mb-2 text-2xl font-bold">문의</h2>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4 text-gray-700">
                        <span className="inline-flex items-center gap-2"><Phone/> {SITE.contact.phone}</span>
                        <Divider orientation="vertical" flexItem />
                        <span className="inline-flex items-center gap-2"><Info/> 담당: {SITE.contact.person}</span>
                    </div>
                </div>
            </section>

            {/* 푸터 */}
            <footer className="mt-12 border-t bg-white/60">
                <div className="mx-auto max-w-6xl px-5 py-6 text-sm text-gray-500">
                    © {new Date().getFullYear()} {SITE.host}. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

// (앞으로 만들) 신청 페이지 자리만 미리 만듦
function RegisterPage() {
    return (
        <div className="mx-auto max-w-3xl px-5 py-16">
            <h1 className="mb-4 text-3xl font-extrabold">참석 신청</h1>
            <Alert severity="info" className="mb-6">
                여기는 신청 폼 자리입니다. 다음 단계에서 입력 폼을 붙여 드릴게요.
            </Alert>
            <Link to="/" className="text-indigo-600 underline">← 설명 페이지로 돌아가기</Link>
        </div>
    )
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<InfoPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    )
}
