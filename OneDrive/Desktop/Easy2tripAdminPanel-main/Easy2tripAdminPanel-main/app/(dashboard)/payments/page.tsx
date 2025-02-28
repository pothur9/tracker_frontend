"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const payments = [
  {
    id: 1,
    transactionId: "TXN001",
    customer: "John Doe",
    date: "2024-04-10",
    amount: "$200",
    method: "Credit Card",
    status: "Completed",
  },
  {
    id: 2,
    transactionId: "TXN002",
    customer: "Jane Smith",
    date: "2024-04-11",
    amount: "$800",
    method: "PayPal",
    status: "Processing",
  },
  {
    id: 3,
    transactionId: "TXN003",
    customer: "Mike Johnson",
    date: "2024-04-12",
    amount: "$350",
    method: "Bank Transfer",
    status: "Failed",
  },
];

export default function PaymentsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Payment Management</h1>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.transactionId}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "Completed"
                          ? "default"
                          : payment.status === "Processing"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}