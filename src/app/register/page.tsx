'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ThemeSwitcher from '@/components/ThemeSwitcher';
import Button from '@/components/Button';
import { type AxiosError } from 'axios';
import api from '@/services/api';
import { toast } from 'react-toastify';

interface RegisterProps {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      name: string;
      email: string;
      id: string;
      createdAt: string;
    };
    token: string;
  };
}

const validationSchema = z
  .object({
    name: z.string().nonempty('Nome é obrigatório.'),
    email: z
      .string()
      .nonempty('Email é obrigatório.')
      .email({ message: 'Informe um e-mail válido.' }),
    password: z
      .string()
      .min(8, { message: 'Senha precisa ter no mínimo 8 caracteres.' })
      .nonempty('Senha é obrigatório.'),
    repeatPassword: z
      .string()
      .min(8, {
        message: 'Repetição de senha precisa ter no mínimo 8 caracteres.'
      })
      .nonempty('Repetição de senha é obrigatório.')
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'As senhas não correspondem.',
    path: ['repeatPassword']
  });

type FormProps = z.infer<typeof validationSchema>;

export default function Register(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError
  } = useForm<FormProps>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: ''
    }
  });

  const handleFormSubmit: SubmitHandler<FormProps> = async (
    data: FormProps
  ): Promise<void> => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password
      };

      setLoading(true);

      await api.post<RegisterProps, RegisterResponse>(
        payload,
        '/users/register'
      );

      toast.success('Usuário registrado com sucesso!');

      setLoading(false);

      router.push('/');
    } catch (e) {
      setLoading(false);
      const error = e as AxiosError;
      toast.error(
        error.response?.status === 403
          ? 'E-mail já cadastrado.'
          : 'Ocorreu um erro ao registrar o usuário, tente novamente.'
      );
    }
  };

  useEffect(() => {
    setError('name', {
      message: undefined
    });
    setError('email', {
      message: undefined
    });
    setError('password', {
      message: undefined
    });
    setError('repeatPassword', {
      message: undefined
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100 dark:bg-gradient-to-r from-black to-slate-900 relative select-none">
      <ThemeSwitcher className="absolute top-2 left-1/2 transform -translate-x-1/2 cursor-pointer" />
      <div className="flex-1 max-w-lg mx-auto px-4 sm:px-6 lg:px-8 relative">
        <FiArrowLeft
          size={25}
          className="absolute top-0 left-3 cursor-pointer"
          onClick={() => {
            router.push('/');
          }}
        />
        <div className="flex text-center flex-col items-center justify-center">
          <Image
            src="/img/shopflix.png"
            width={200}
            height={200}
            alt="Shopflix Logo"
          />

          <p className="mt-3 text-gray-500 dark:text-gray-300">
            Registre-se para começar a usar sua lista de compras!
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="name"
                  className="text-sm text-gray-600 dark:text-gray-200"
                >
                  Nome
                </label>
              </div>

              <input
                {...register('name')}
                type="text"
                name="name"
                placeholder="Seu nome"
                className={`${
                  errors.name?.message !== undefined
                    ? 'border border-red-500'
                    : ''
                }  focus:outline-none relative block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700focus:outline-none`}
              />
              {errors.name?.message !== undefined && (
                <p className="absolute text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mt-8">
              <label
                htmlFor="email"
                className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
              >
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="exemplo@exemplo.com"
                className={`${
                  errors.email?.message !== undefined
                    ? 'border border-red-500'
                    : ''
                }  focus:outline-none relative block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700focus:outline-none`}
              />
              {errors.email?.message !== undefined && (
                <p className="absolute text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm text-gray-600 dark:text-gray-200"
                >
                  Senha
                </label>
              </div>

              <input
                {...register('password')}
                type="password"
                placeholder="Sua senha"
                className={`${
                  errors.password?.message !== undefined
                    ? 'border border-red-500'
                    : ''
                }  focus:outline-none relative block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700focus:outline-none`}
              />
              {errors.password?.message !== undefined && (
                <p className="absolute text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="passwordRepeat"
                  className="text-sm text-gray-600 dark:text-gray-200"
                >
                  Repetição de senha
                </label>
              </div>
              <input
                {...register('repeatPassword')}
                type="password"
                placeholder="Repita sua senha"
                className={`${
                  errors.repeatPassword?.message !== undefined
                    ? 'border border-red-500'
                    : ''
                }  focus:outline-none relative block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700focus:outline-none`}
              />
              {errors.repeatPassword?.message !== undefined && (
                <p className="absolute text-red-500 text-sm mt-1">
                  {errors.repeatPassword.message}
                </p>
              )}
            </div>

            <div className="mt-8 sm:mt-14">
              <Button
                loading={loading}
                disabled={Object.entries(errors).length > 0}
                text="Registrar-se"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
