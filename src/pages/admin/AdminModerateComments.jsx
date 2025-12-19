import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, XCircle, Trash2, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { commentService } from '@/services/commentService';
import { newsService } from '@/services/newsService';
import { eventService } from '@/services/eventService';

const AdminModerateComments = () => {
    const { toast } = useToast();
    const [allComments, setAllComments] = useState([]); // All comments for statistics
    const [comments, setComments] = useState([]); // Filtered comments for display
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [typeFilter, setTypeFilter] = useState('all');
    const [expandedComments, setExpandedComments] = useState(new Set());

    // Load all comments for statistics
    useEffect(() => {
        loadAllComments();
    }, []);

    // Filter comments when filters change
    useEffect(() => {
        filterComments();
    }, [allComments, statusFilter, typeFilter, searchTerm]);

    const loadAllComments = async () => {
        try {
            setLoading(true);
            // Always load ALL comments (no filters) for accurate statistics
            const data = await commentService.getAllComments(null, null);
            setAllComments(data);
        } catch (error) {
            console.error('Error loading comments:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível carregar os comentários.',
            });
        } finally {
            setLoading(false);
        }
    };

    const filterComments = () => {
        let filtered = [...allComments];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(c => c.status === statusFilter);
        }

        // Filter by type
        if (typeFilter !== 'all') {
            filtered = filtered.filter(c => c.target_type === typeFilter);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(comment =>
                comment.content?.toLowerCase().includes(searchLower) ||
                comment.author_name?.toLowerCase().includes(searchLower) ||
                comment.author_email?.toLowerCase().includes(searchLower)
            );
        }

        // Sort by created_at descending
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setComments(filtered);
    };

    const handleStatusChange = async (commentId, newStatus) => {
        try {
            await commentService.updateCommentStatus(commentId, newStatus);
            toast({
                title: '✅ Sucesso!',
                description: `Comentário ${newStatus === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso.`,
            });
            // Update the comment in allComments state immediately for instant UI update
            setAllComments(prev => prev.map(c => 
                c.id === commentId ? { ...c, status: newStatus } : c
            ));
            // Reload all comments to ensure sync with database
            loadAllComments();
        } catch (error) {
            console.error('Error updating comment status:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível atualizar o status do comentário.',
            });
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await commentService.deleteComment(commentId);
            toast({
                title: '✅ Comentário Excluído',
                description: 'O comentário foi removido permanentemente.',
            });
            // Remove from allComments state immediately
            setAllComments(prev => prev.filter(c => c.id !== commentId));
            // Reload to ensure sync
            loadAllComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível excluir o comentário.',
            });
        }
    };

    const toggleExpand = (commentId) => {
        setExpandedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-600 text-white">Aprovado</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-500 text-black">Pendente</Badge>;
            case 'rejected':
                return <Badge className="bg-red-600 text-white">Rejeitado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'news':
                return 'Notícia';
            case 'event':
                return 'Evento';
            case 'blog':
                return 'Blog';
            default:
                return type;
        }
    };

    // Calculate statistics from ALL comments, not filtered ones
    const pendingCount = allComments.filter(c => c.status === 'pending').length;
    const approvedCount = allComments.filter(c => c.status === 'approved').length;
    const rejectedCount = allComments.filter(c => c.status === 'rejected').length;

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Moderar Comentários</title></Helmet>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                        <MessageSquare className="mr-3 text-blue-600" /> Moderar Comentários
                    </h1>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-yellow-50 border-yellow-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pendentes</p>
                                    <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
                                </div>
                                <MessageSquare className="text-yellow-600" size={32} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Aprovados</p>
                                    <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
                                </div>
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Rejeitados</p>
                                    <p className="text-2xl font-bold text-red-700">{rejectedCount}</p>
                                </div>
                                <XCircle className="text-red-600" size={32} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border-gray-400 bg-white mb-6">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <Input
                                    placeholder="Buscar por autor, email ou conteúdo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-gray-400 bg-white"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="border-gray-400 bg-white">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pendentes</SelectItem>
                                    <SelectItem value="approved">Aprovados</SelectItem>
                                    <SelectItem value="rejected">Rejeitados</SelectItem>
                                    <SelectItem value="all">Todos</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="border-gray-400 bg-white">
                                    <SelectValue placeholder="Filtrar por tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Tipos</SelectItem>
                                    <SelectItem value="news">Notícias</SelectItem>
                                    <SelectItem value="event">Eventos</SelectItem>
                                    <SelectItem value="blog">Blog</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Comments List */}
                <Card className="border-gray-400 bg-white">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            {statusFilter === 'pending' && 'Comentários Pendentes'}
                            {statusFilter === 'approved' && 'Comentários Aprovados'}
                            {statusFilter === 'rejected' && 'Comentários Rejeitados'}
                            {statusFilter === 'all' && 'Todos os Comentários'}
                            {comments.length > 0 && ` (${comments.length})`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-gray-600">Carregando comentários...</div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-8 text-gray-600">
                                Nenhum comentário encontrado.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="flex items-start gap-4 p-4 border rounded-lg border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <Avatar>
                                            <AvatarImage src={comment.author_avatar} />
                                            <AvatarFallback>
                                                {(comment.author_name || 'V').charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">
                                                        {comment.author_name || 'Visitante'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {comment.author_email || 'Sem email'}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {getStatusBadge(comment.status)}
                                                        <Badge variant="outline">
                                                            {getTypeLabel(comment.target_type)}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-800 mt-2 whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {comment.status === 'pending' && (
                                                <>
                                                    <Button
                                                        onClick={() => handleStatusChange(comment.id, 'approved')}
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Aprovar"
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleStatusChange(comment.id, 'rejected')}
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Rejeitar"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <XCircle size={20} />
                                                    </Button>
                                                </>
                                            )}
                                            {comment.status === 'approved' && (
                                                <Button
                                                    onClick={() => handleStatusChange(comment.id, 'rejected')}
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Rejeitar"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <XCircle size={20} />
                                                </Button>
                                            )}
                                            {comment.status === 'rejected' && (
                                                <Button
                                                    onClick={() => handleStatusChange(comment.id, 'approved')}
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Aprovar"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                >
                                                    <CheckCircle size={20} />
                                                </Button>
                                            )}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Excluir"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={20} />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="max-w-md border-2 border-red-200 shadow-xl bg-white">
                                                    <AlertDialogHeader className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-red-100 rounded-full">
                                                                <Trash2 className="text-red-600" size={24} />
                                                            </div>
                                                            <AlertDialogTitle className="text-xl font-bold text-gray-900">
                                                                Confirmar Exclusão
                                                            </AlertDialogTitle>
                                                        </div>
                                                        <AlertDialogDescription className="text-base text-gray-700 leading-relaxed pt-2">
                                                            Tem certeza que deseja excluir este comentário permanentemente?
                                                            <br />
                                                            <span className="font-semibold text-red-600 mt-2 block">
                                                                Esta ação não pode ser desfeita.
                                                            </span>
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <div className="my-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                        <p className="text-sm text-gray-600 font-medium mb-1">Comentário:</p>
                                                        <p className="text-sm text-gray-800 italic line-clamp-2">
                                                            "{comment.content}"
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            Por: {comment.author_name || 'Visitante'}
                                                        </p>
                                                    </div>
                                                    <AlertDialogFooter className="gap-2 sm:gap-0">
                                                        <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">
                                                            Cancelar
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(comment.id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                                                        >
                                                            <Trash2 size={16} className="mr-2" />
                                                            Excluir Permanentemente
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminModerateComments;

