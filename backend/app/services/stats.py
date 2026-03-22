from typing import List
from app.models.submission import SalarySubmission
from app.schemas.company import CompanyStats


def calculate_salary_stats(submissions: List[SalarySubmission]) -> CompanyStats:
    if not submissions:
        return CompanyStats(submission_count=0)

    salaries = sorted([s.salary for s in submissions])
    n = len(salaries)
    avg = sum(salaries) / n

    if n % 2 == 0:
        median = (salaries[n // 2 - 1] + salaries[n // 2]) / 2
    else:
        median = float(salaries[n // 2])

    stacks: set[str] = set()
    for s in submissions:
        if s.tech_stack:
            for t in s.tech_stack.split(","):
                t = t.strip()
                if t:
                    stacks.add(t)

    return CompanyStats(
        avg_salary=round(avg, 1),
        median_salary=round(median, 1),
        min_salary=salaries[0],
        max_salary=salaries[-1],
        submission_count=n,
        tech_stacks=sorted(stacks),
    )
