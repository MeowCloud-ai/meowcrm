"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { type Contact } from "@/lib/validations/contact"
import { ContactFormDialog } from "@/components/contact-form-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Users } from "lucide-react"

interface ContactListProps {
  customerId: string
  initialContacts: Contact[]
}

export function ContactList({ customerId, initialContacts }: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchContacts = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })
    if (data) setContacts(data)
  }, [customerId])

  useEffect(() => {
    setContacts(initialContacts)
  }, [initialContacts])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("contacts").delete().eq("id", id)
      if (error) throw error
      await fetchContacts()
    } catch {
      alert("刪除失敗，請稍後再試")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">聯絡人</CardTitle>
        <ContactFormDialog customerId={customerId} onSuccess={fetchContacts} />
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
            <Users className="h-10 w-10" />
            <p>尚無聯絡人</p>
            <p className="text-sm">點擊「新增聯絡人」來建立第一筆資料</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>職稱</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>電話</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.title ?? "—"}</TableCell>
                  <TableCell>{contact.email ?? "—"}</TableCell>
                  <TableCell>{contact.phone ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <ContactFormDialog
                        customerId={customerId}
                        contact={contact}
                        onSuccess={fetchContacts}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deleting === contact.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>確認刪除聯絡人</AlertDialogTitle>
                            <AlertDialogDescription>
                              確定要刪除「{contact.name}」嗎？此操作無法復原。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(contact.id)}
                              disabled={deleting === contact.id}
                            >
                              {deleting === contact.id ? "刪除中..." : "確認刪除"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
