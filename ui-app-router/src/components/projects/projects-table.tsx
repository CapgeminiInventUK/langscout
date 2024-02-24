"use client";

import { ProjectResponse } from '@/models/responses/projects-response';
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

interface ProjectsTableProps {
    projects: ProjectResponse[];
}

 export default function ProjectsTable ({ projects }: ProjectsTableProps) {
    const handleRowClick = (url: string) => {
        window.location.href = url;
    };

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Traces 24h</TableHead>
                <TableHead>Traces 7d</TableHead>
                <TableHead>Traces 30d</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {projects.map((project, index) => (
              <TableRow key={index}
                        onClick={() => handleRowClick(`/projects/${project.project_name}`)}>
                  <TableCell>{project.project_name}</TableCell>
                  <TableCell>{project.tracesLast24Hours}</TableCell>
                  <TableCell>{project.tracesLast7Days}</TableCell>
                  <TableCell>{project.tracesLast30Days}</TableCell>
              </TableRow>
            ))}
        </TableBody>
    </Table>
}
