# GitHub Setup Guide

This guide will walk you through the process of pushing your OKR Management System to GitHub.

## Prerequisites

1. [Git](https://git-scm.com/) installed on your local machine
2. A [GitHub](https://github.com/) account
3. The OKR Management System codebase downloaded to your local machine

## Setting Up GitHub Repository

### 1. Create a New Repository on GitHub

1. Log in to your GitHub account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Enter a name for your repository (e.g., "okr-management-system")
4. Optional: Add a description
5. Choose whether the repository should be public or private
6. Do NOT initialize the repository with a README, .gitignore, or license file
7. Click "Create repository"

### 2. Initialize Git in Your Local Project

Open a terminal or command prompt, navigate to your project directory, and run:

```bash
# Navigate to your project directory (if you're not already there)
cd path/to/okr-management-system

# Initialize Git repository
git init
```

### 3. Add Your Files to the Git Repository

```bash
# Add all files to the staging area
git add .

# Commit the changes
git commit -m "Initial commit"
```

### 4. Link Your Local Repository to GitHub

```bash
# Add the GitHub repository as a remote
git remote add origin https://github.com/YOUR_USERNAME/okr-management-system.git

# Push your code to GitHub
git push -u origin main
```

Note: If your default branch is `master` instead of `main`, use:

```bash
git push -u origin master
```

## Working with Branches

### Creating a New Branch

```bash
# Create and switch to a new branch
git checkout -b feature/new-feature
```

### Pushing Changes to GitHub

```bash
# After making changes, add and commit them
git add .
git commit -m "Add new feature"

# Push the branch to GitHub
git push -u origin feature/new-feature
```

### Merging Changes

To merge your changes back into the main branch:

1. Create a Pull Request on GitHub
2. Review the changes
3. Merge the Pull Request

## Best Practices

1. **Commit Often**: Make small, focused commits with clear messages
2. **Use Branches**: Create separate branches for different features/fixes
3. **Pull Regularly**: Keep your local repository updated with `git pull`
4. **Write Descriptive Commit Messages**: Explain what changes you made and why
5. **Review Before Committing**: Check your changes with `git diff` before committing

## Troubleshooting

### Authentication Issues

If you encounter authentication issues when pushing to GitHub:

1. You might need to set up SSH keys or use a personal access token
2. Follow GitHub's guide on [setting up authentication](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

### Resolving Merge Conflicts

If you encounter merge conflicts:

1. Use `git status` to see which files have conflicts
2. Open the files and resolve the conflicts manually
3. Add the resolved files with `git add`
4. Complete the merge with `git commit`

## Additional Resources

- [GitHub Docs](https://docs.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Pro Git Book](https://git-scm.com/book/en/v2)