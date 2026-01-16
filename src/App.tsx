import { useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'

const newsFinancialLinks = [
  { label: 'IDX News', href: 'https://www.idx.co.id/id/berita/berita/' },
  { label: 'CNBC Indonesia', href: 'https://www.cnbcindonesia.com/market' },
  { label: 'Kontan', href: 'https://investasi.kontan.co.id/' },
]

const idxLinks = [
  {
    label: 'Keterbukaan Informasi',
    href: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi',
  },
  { label: 'Stock Screener', href: 'https://www.idx.co.id/id/investhub/stock-screener/' },
  {
    label: 'Profil Perusahaan',
    href: 'https://www.idx.co.id/id/perusahaan-tercatat/profil-perusahaan-tercatat',
  },
]

const analysisLinks = [
  { label: 'TradingView', href: 'https://www.tradingview.com/' },
  {
    label: 'Chart Pattern',
    href: 'https://www.chartguys.com/chart-pattern-cheat-sheet',
  },
]

function Button({
  children,
  onClick,
  asLink,
  href,
}: {
  children: React.ReactNode
  onClick?: () => void
  asLink?: boolean
  href?: string
}) {
  const base =
    'inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50'

  if (asLink && href) {
    return (
      <a className={base} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button className={base} onClick={onClick} type="button">
      {children}
    </button>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </section>
  )
}

function Home() {
  const [activeSection, setActiveSection] = useState<
    'hitung' | 'news' | 'idx' | 'analysis'
  >('hitung')
  const [rows, setRows] = useState([
    { price: '', lot: '' },
    { price: '', lot: '' },
  ])

  const totals = useMemo(() => {
    const parsed = rows.map((row) => ({
      price: Number(row.price),
      lot: Number(row.lot),
    }))

    const totalLot = parsed.reduce((sum, row) => sum + (isNaN(row.lot) ? 0 : row.lot), 0)
    const totalValue = parsed.reduce(
      (sum, row) =>
        sum + (isNaN(row.price) || isNaN(row.lot) ? 0 : row.price * row.lot * 100),
      0
    )
    const average = totalLot > 0 ? totalValue / (totalLot * 100) : 0

    return { totalLot, totalValue, average }
  }, [rows])

  const averageDisplay = useMemo(
    () =>
      new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(totals.average),
    [totals.average]
  )

  const updateRow = (index: number, key: 'price' | 'lot', value: string) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row
      )
    )
  }

  const addRow = () => {
    setRows((current) => [...current, { price: '', lot: '' }])
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Traider Victory</h1>
        <p className="text-slate-600">
          Menu minimalis untuk akses cepat ke riset, berita, dan data IDX.
        </p>
      </div>

      <Section
        title="Aksi Utama"
        description="Pilih salah satu menu utama untuk membuka opsi lebih detail."
      >
        <Button onClick={() => setActiveSection('hitung')}>Hitung Barang</Button>
        <Button onClick={() => setActiveSection('news')}>News Financial</Button>
        <Button onClick={() => setActiveSection('idx')}>IDX</Button>
        <Button onClick={() => setActiveSection('analysis')}>
          Technical Analisis
        </Button>
      </Section>

      {activeSection === 'hitung' && (
        <Section
          title="Hitung Barang"
          description="Hitung average saham berdasarkan harga beli dan jumlah lot."
        >
          <div className="w-full space-y-4">
            <div className="grid gap-3 md:grid-cols-[1.5fr_1fr]">
              <div className="flex justify-end md:hidden">
                <div className="flex gap-2">
                  <button
                    aria-label="Tambah harga"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-base font-semibold text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                    onClick={addRow}
                    type="button"
                  >
                    +
                  </button>
                  <button
                    aria-label="Reset"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-base font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    onClick={() =>
                      setRows([
                        { price: '', lot: '' },
                        { price: '', lot: '' },
                      ])
                    }
                    type="button"
                  >
                    {'\u27F2'}
                  </button>
                </div>
              </div>
              {rows.map((row, index) => (
                <div
                  className="grid gap-3 md:col-span-2 md:grid-cols-[1.5fr_1fr]"
                  key={`row-${index}`}
                >
                  <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Harga Beli {index + 1}
                    </span>
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                      inputMode="numeric"
                      min={0}
                      onChange={(event) =>
                        updateRow(index, 'price', event.target.value)
                      }
                      placeholder="Contoh: 1200"
                      step={1}
                      type="number"
                      value={row.price}
                    />
                  </label>
                  <label className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Lot
                      </span>
                      {index === 0 ? (
                        <div className="hidden gap-2 md:flex">
                          <button
                            aria-label="Tambah harga"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-sm font-semibold text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                            onClick={addRow}
                            type="button"
                          >
                            +
                          </button>
                          <button
                            aria-label="Reset"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                            onClick={() =>
                              setRows([
                                { price: '', lot: '' },
                                { price: '', lot: '' },
                              ])
                            }
                            type="button"
                          >
                            {'\u27F2'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                      inputMode="numeric"
                      min={0}
                      onChange={(event) =>
                        updateRow(index, 'lot', event.target.value)
                      }
                      placeholder="Contoh: 10"
                      step={1}
                      type="number"
                      value={row.lot}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Lot
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {totals.totalLot.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Modal
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Rp {totals.totalValue.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Average Harga
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Rp {averageDisplay}
                </p>
              </div>
            </div>
          </div>
        </Section>
      )}

      {activeSection === 'news' && (
        <Section
          title="News Financial"
          description="Klik salah satu sumber berita finansial."
        >
          {newsFinancialLinks.map((item) => (
            <Button key={item.label} asLink href={item.href}>
              {item.label}
            </Button>
          ))}
        </Section>
      )}

      {activeSection === 'idx' && (
        <Section
          title="IDX"
          description="Akses cepat ke halaman-halaman penting di IDX."
        >
          {idxLinks.map((item) => (
            <Button key={item.label} asLink href={item.href}>
              {item.label}
            </Button>
          ))}
        </Section>
      )}

      {activeSection === 'analysis' && (
        <Section
          title="Technical Analisis"
          description="Sumber pendukung analisis teknikal."
        >
          {analysisLinks.map((item) => (
            <Button key={item.label} asLink href={item.href}>
              {item.label}
            </Button>
          ))}
        </Section>
      )}
    </section>
  )
}

function About() {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold tracking-tight">About</h2>
      <p className="text-slate-600">
        Ruang singkat untuk ide, strategi, dan target berikutnya. Jadikan halaman
        ini catatan taktikmu.
      </p>
      <Link className="text-sm font-semibold text-slate-900 underline" to="/">
        Kembali ke Home
      </Link>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            victory
          </span>
          <nav className="flex gap-4 text-sm font-medium">
            <Link className="text-slate-700 hover:text-slate-900" to="/">
              Home
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/about">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 py-6">
        <p className="text-center text-xs text-slate-500">
          @copyright 2026 by.Appank
        </p>
      </footer>
    </div>
  )
}

