import type { MetaFunction } from "react-router";
import { AdminChats } from "~/components/admin/AdminChats";
import { AdminLeads } from "~/components/admin/AdminLeads";
import { Login, Shell } from "~/components/admin/AdminShell";
import { useAdmin } from "~/hooks/useAdmin";

// Админка: пререндерится пустой оболочкой, всё остальное — в браузере через
// /api/admin/* (workers/admin.ts). В поиске её нет, языковых версий тоже.
export const meta: MetaFunction = () => [{ title: "Админка — ONEZA" }, { name: "robots", content: "noindex, nofollow" }];

export default function Admin() {
  const admin = useAdmin();
  if (!admin.mounted || admin.authed === null) return <div className="admin-shell min-h-svh" />;
  if (!admin.authed) return <Login password={admin.password} setPassword={admin.setPassword} error={admin.loginError} onSubmit={admin.login} />;

  return (
    <Shell page={admin.page} setPage={admin.setPage} badges={{ chats: admin.unreadTotal, leads: admin.openLeads }} title={admin.page === "chats" ? "Чат с посетителями" : "Заявки с сайта"} onLogout={admin.logout}>
      {admin.error && <p className="mb-4 text-sm text-error">{admin.error}</p>}
      {admin.page === "chats" ? (
        <AdminChats chats={admin.chats} active={admin.active} activeId={admin.activeId} setActiveId={admin.setActiveId} messages={admin.messages} browserLang={admin.browserLang} reply={admin.reply} setReply={admin.setReply} sending={admin.sending} sendReply={admin.sendReply} scroller={admin.scroller} />
      ) : (
        <AdminLeads leads={admin.leads} onToggle={admin.toggleLeadDone} />
      )}
    </Shell>
  );
}
