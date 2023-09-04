import { zodResolver } from '@hookform/resolvers/zod';
import { Close } from '@mui/icons-material';
import { Box, Button, CircularProgress, Divider, Grid, IconButton, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { buttonProps, inputProps } from '../../configs/Layout';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CreateUserReturn } from '../../store/modules/Users/types';
import { createLoginAsyncThunk } from '../../store/modules/Users/usersSlice';

const schemaCreateAccount = z
	.object({
		name: z.string().nonempty(),
		password: z.string().min(4, 'Senha menor que 4 dígitos'),
		passwordConfirm: z.string().min(4, 'Senha menor que 4 dígitos'),
	})
	.refine(({ password, passwordConfirm }) => password === passwordConfirm, {
		message: 'Senhas não conferem',
		path: ['passwordConfirm'],
	});

type TCreateUser = z.infer<typeof schemaCreateAccount>;

interface ModalSignupUserProps {
	open: boolean;
	changeOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalSignupUser: React.FC<ModalSignupUserProps> = ({ open, changeOpen }) => {
	const userState = useAppSelector((state) => state.users);
	const dispatch = useAppDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<TCreateUser>({
		resolver: zodResolver(schemaCreateAccount),
	});

	const onSubmit: SubmitHandler<TCreateUser> = async (data) => {
		const user = (await dispatch(createLoginAsyncThunk(data))).payload as CreateUserReturn;

		if (!user.success) return;
		handleClose();
	};

	const handleClose = () => {
		setValue('name', '');
		setValue('password', '');
		setValue('passwordConfirm', '');
		changeOpen(false);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			PaperProps={{
				sx: {
					borderRadius: '20px',
					boxShadow: 'inset 2px 2px 5px #ffffff34, inset -5px -5px 5px #babecc46',

					backdropFilter: 'blur(6px)',
				},
			}}>
			<DialogTitle id="alert-dialog-title">
				{'Crie sua conta!'}

				<IconButton
					aria-label="close"
					onClick={handleClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
					}}>
					<Close />
				</IconButton>
			</DialogTitle>

			<Divider />
			<Box component="form" onSubmit={handleSubmit(onSubmit)}>
				<DialogContent sx={{ marginY: 2 }}>
					<Grid container>
						<Grid item xs={12}>
							<TextField
								{...register('name')}
								variant="standard"
								placeholder="Nome"
								error={!!errors.name}
								helperText={errors.name?.message}
								sx={inputProps}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register('password')}
								variant="standard"
								placeholder="Senha"
								type="password"
								error={!!errors.password}
								helperText={errors.password?.message}
								sx={inputProps}
							/>
							<TextField
								{...register('passwordConfirm')}
								variant="standard"
								placeholder="Confirmar Senha"
								type="password"
								error={!!errors.passwordConfirm}
								helperText={errors.passwordConfirm?.message}
								sx={[inputProps, { marginBottom: '0' }]}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<Divider />

				<DialogActions sx={{ padding: 3, justifyContent: 'space-between' }}>
					<Button
						color="secondary"
						variant="outlined"
						type="button"
						onClick={handleClose}
						sx={[buttonProps, { width: '30%', marginBottom: 0 }]}>
						Cancelar
					</Button>
					<Button
						color="secondary"
						variant="outlined"
						type="submit"
						disabled={userState.loading}
						startIcon={
							userState.loading ? (
								<CircularProgress size={30} color="secondary" />
							) : (
								<></>
							)
						}
						sx={[buttonProps, { width: '30%', marginBottom: 0 }]}>
						Cadastrar
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};

export default ModalSignupUser;
