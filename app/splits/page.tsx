'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, Trash2, Receipt, UserPlus, Users, History } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { AddSplitSheet } from '@/components/splits/AddSplitSheet'
import { AddContactSheet } from '@/components/splits/AddContactSheet'
import { useUser } from '@/lib/user-context'
import { useSplits } from '@/lib/hooks/useSplits'
import { useCurrency } from '@/lib/currency'

export default function SplitsPage() {
  const router = useRouter()
  const { user } = useUser()
  const { format } = useCurrency()
  const {
    contacts, splits, balances, totalOwedToMe, totalIOwe,
    addContact, removeContact, addSplit, removeSplit,
  } = useSplits(user?.id)

  const [openSplit, setOpenSplit] = useState(false)
  const [openContact, setOpenContact] = useState(false)
  /** When set, reopen split sheet after contact is added and pre-toggle this id. */
  const returnToSplitRef = useRef(false)
  const [pendingPreSelect, setPendingPreSelect] = useState<string | null>(null)

  const meName = user?.name || 'You'

  return (
    <AppShell userId={user?.id} userName={user?.name} hideBottomNav={openSplit || openContact}>
      <div style={{ height: 'max(24px, env(safe-area-inset-top))', background: '#EDE4D8' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px 16px' }}>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          style={{
            width: 36, height: 36, borderRadius: '50%', background: '#fff',
            border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={20} color="#1A1410" />
        </button>
        <h1 style={{ flex: 1, fontWeight: 700, fontSize: 22, color: '#1A1410', letterSpacing: '-0.01em' }}>
          Split Bills
        </h1>
        <button
          type="button"
          onClick={() => setOpenContact(true)}
          aria-label="Add person"
          style={{
            width: 36, height: 36, borderRadius: '50%', background: '#fff',
            border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <UserPlus size={18} color="#1A1410" />
        </button>
      </div>

      {/* Summary card */}
      <div
        style={{
          margin: '0 20px 16px',
          padding: 18,
          borderRadius: 22,
          background: 'linear-gradient(155deg, #1F1A17 0%, #0E0B09 100%)',
          color: '#fff',
          boxShadow: '0 12px 36px rgba(0,0,0,0.22)',
        }}
      >
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
          Net Balance
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>Owed to you</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#34D399' }}>
              {format(totalOwedToMe, { decimals: 2 })}
            </p>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>You owe</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#F87171' }}>
              {format(totalIOwe, { decimals: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Add Split CTA */}
      <div style={{ padding: '0 20px 16px' }}>
        <button
          type="button"
          onClick={() => {
            if (contacts.length === 0) {
              alert('Add a person first to split bills with.')
              setOpenContact(true)
              return
            }
            setOpenSplit(true)
          }}
          style={{
            width: '100%',
            height: 52,
            borderRadius: 16,
            background: '#D07850',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: 'inherit',
            boxShadow: '0 6px 18px rgba(208,120,80,0.32)',
          }}
        >
          <Plus size={18} /> New Split
        </button>
      </div>

      {/* People */}
      <Section title="People" icon={<Users size={14} />}>
        {contacts.length === 0 ? (
          <Empty hint="Add someone you split bills with." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {contacts.map(c => {
              const bal = balances.get(c.id) ?? 0
              const tone = bal > 0.005 ? 'in' : bal < -0.005 ? 'out' : 'neutral'
              return (
                <div
                  key={c.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: '#fff', borderRadius: 14, padding: '12px 14px',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#FBE7D9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#A85D3A', fontWeight: 700, fontSize: 14, flexShrink: 0,
                  }}>
                    {initial(c.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#1A1410' }}>{c.name}</p>
                    <p style={{
                      fontSize: 11,
                      color: tone === 'in' ? '#2C6A49' : tone === 'out' ? '#A85D3A' : '#A8998A',
                      fontWeight: 600,
                    }}>
                      {tone === 'in'
                        ? `Owes you ${format(bal, { decimals: 2 })}`
                        : tone === 'out'
                          ? `You owe ${format(-bal, { decimals: 2 })}`
                          : 'Settled up'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove ${c.name}? Their splits will be deleted too.`)) removeContact(c.id)
                    }}
                    aria-label="Remove"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
                  >
                    <Trash2 size={16} color="#D03C3C" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </Section>

      {/* Splits */}
      <Section title="Recent Splits" icon={<History size={14} />}>
        {splits.length === 0 ? (
          <Empty hint="Splits you create show up here." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {splits.map(sp => {
              const payerName = sp.payerId === 'me' ? meName : (contacts.find(c => c.id === sp.payerId)?.name ?? 'Unknown')
              const share = sp.totalAmount / sp.participantIds.length
              return (
                <div
                  key={sp.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: '#fff', borderRadius: 14, padding: '12px 14px',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 12,
                    background: '#F8F4EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Receipt size={16} color="#65574A" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#1A1410', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sp.note || 'Split'}
                    </p>
                    <p style={{ fontSize: 11, color: '#A8998A' }}>
                      {payerName} paid · {sp.participantIds.length} people · {format(share, { decimals: 2 })} each
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1410' }}>
                      {format(sp.totalAmount, { decimals: 2 })}
                    </p>
                    <p style={{ fontSize: 10, color: '#A8998A' }}>{sp.date}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { if (confirm('Delete this split?')) removeSplit(sp.id) }}
                    aria-label="Delete"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
                  >
                    <Trash2 size={16} color="#D03C3C" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </Section>

      <AddSplitSheet
        open={openSplit}
        onClose={() => setOpenSplit(false)}
        contacts={contacts}
        meName={meName}
        onSave={addSplit}
        preSelectId={pendingPreSelect}
        onConsumePreSelect={() => setPendingPreSelect(null)}
        onAddContact={() => {
          returnToSplitRef.current = true
          setOpenSplit(false)
          setOpenContact(true)
        }}
      />
      <AddContactSheet
        open={openContact}
        onClose={() => {
          setOpenContact(false)
          if (returnToSplitRef.current) {
            returnToSplitRef.current = false
            // Reopen split sheet on next tick so the contact list re-renders fresh
            setTimeout(() => setOpenSplit(true), 60)
          }
        }}
        onAdd={(name) => {
          const c = addContact(name)
          if (returnToSplitRef.current) setPendingPreSelect(c.id)
          return c.id
        }}
      />
    </AppShell>
  )
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ margin: '0 20px 16px' }}>
      <p style={{
        padding: '0 4px 8px',
        fontWeight: 600, fontSize: 12,
        letterSpacing: '0.06em', textTransform: 'uppercase', color: '#65574A',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {icon} {title}
      </p>
      {children}
    </div>
  )
}

function Empty({ hint }: { hint: string }) {
  return (
    <div style={{
      background: '#fff', border: '1px dashed rgba(0,0,0,0.12)',
      borderRadius: 14, padding: 18, textAlign: 'center',
      color: '#A8998A', fontSize: 13,
    }}>
      {hint}
    </div>
  )
}

function initial(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
}
